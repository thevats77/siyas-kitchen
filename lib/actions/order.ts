"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type OrderInput = {
  customerName?: string;
  itemsOrdered: string;
  amount: number;
  source: string;
  paymentMethod: string;
  expenseAmount?: number;
  expensePaymentMethod?: string;
};

export async function getOrders() {
  return prisma.order.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getTodayStats() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start } },
  });
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
}

export async function deleteOrder(id: string) {
  await prisma.order.delete({ where: { id } });
  revalidatePath("/dashboard");
}
