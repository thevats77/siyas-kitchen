"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getFilterRangeUTC, type DashboardFilter } from "@/lib/date";

export type OrderInput = {
  customerName?: string;
  itemsOrdered: string;
  amount: number;
  source: string;
  paymentMethod: string;
  expenseAmount?: number;
  expensePaymentMethod?: string;
};

/**
 * Fetches orders, optionally restricted to an IST-based date range (defaults
 * to "all"). Used by both the dashboard (per-filter) and the history page
 * (filter="all").
 */
export async function getOrders(filter: DashboardFilter = "all") {
  const { gte, lt } = getFilterRangeUTC(filter);
  return prisma.order.findMany({
    where: gte || lt ? { createdAt: { gte, lt } } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

/** Aggregate stats for an IST-based date range filter (defaults to "today"). */
export async function getStats(filter: DashboardFilter = "today") {
  const orders = await getOrders(filter);
  const totalSales = orders.reduce(
    (s: number, o: { amount: number }) => s + o.amount,
    0
  );
  const cashReceived = orders
    .filter((o: { paymentMethod: string }) => o.paymentMethod === "Cash")
    .reduce((s: number, o: { amount: number }) => s + o.amount, 0);
  const upiReceived = orders
    .filter((o: { paymentMethod: string }) => o.paymentMethod === "UPI")
    .reduce((s: number, o: { amount: number }) => s + o.amount, 0);
  const totalExpense = orders.reduce(
    (s: number, o: { expenseAmount: number | null }) =>
      s + (o.expenseAmount ?? 0),
    0
  );
  return {
    count: orders.length,
    totalSales,
    cashReceived,
    upiReceived,
    totalExpense,
  };
}

export async function createOrder(data: OrderInput) {
  await prisma.order.create({
    data: {
      customerName: data.customerName || null,
      itemsOrdered: data.itemsOrdered,
      amount: data.amount,
      source: data.source,
      paymentMethod: data.paymentMethod,
      expenseAmount: data.expenseAmount ?? null,
      expensePaymentMethod: data.expenseAmount
        ? data.expensePaymentMethod ?? null
        : null,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/history");
}

export async function updateOrder(id: string, data: OrderInput) {
  await prisma.order.update({
    where: { id },
    data: {
      customerName: data.customerName || null,
      itemsOrdered: data.itemsOrdered,
      amount: data.amount,
      source: data.source,
      paymentMethod: data.paymentMethod,
      expenseAmount: data.expenseAmount ?? null,
      expensePaymentMethod: data.expenseAmount
        ? data.expensePaymentMethod ?? null
        : null,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/history");
}

export async function deleteOrder(id: string) {
  await prisma.order.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath("/history");
}
