import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderActions } from "@/components/order-actions";
import { sourceBadgeClass, paymentBadgeClass } from "@/lib/badge-colors";

export type OrderRow = {
  id: string;
  customerName: string | null;
  itemsOrdered: string;
  amount: number;
  source: string;
  paymentMethod: string;
  expenseAmount: number | null;
  expensePaymentMethod: string | null;
  createdAt: Date;
};

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
      <span className="text-6xl">🍽️</span>
      <p className="mt-4 text-xl font-semibold text-[#111827]">
        No Orders Yet
      </p>
      <p className="mt-2 text-base text-[#6B7280]">
        Tap the green button below to add today&apos;s first order.
      </p>
    </div>
  );
}

export function RecentOrders({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) return <EmptyState />;

  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl bg-white shadow-sm md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm">Time</TableHead>
              <TableHead className="text-sm">Customer</TableHead>
              <TableHead className="text-sm">Items</TableHead>
              <TableHead className="text-sm">Source</TableHead>
              <TableHead className="text-sm">Amount</TableHead>
              <TableHead className="text-sm">Payment</TableHead>
              <TableHead className="text-sm">Expense</TableHead>
              <TableHead className="text-sm">Expense Payment</TableHead>
              <TableHead className="text-sm text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="text-base whitespace-nowrap">
                  {formatTime(o.createdAt)}
                </TableCell>
                <TableCell className="text-base">
                  {o.customerName || "—"}
                </TableCell>
                <TableCell className="text-base max-w-[220px] truncate">
                  {o.itemsOrdered}
                </TableCell>
                <TableCell>
                  <Badge className={sourceBadgeClass(o.source)}>
                    {o.source}
                  </Badge>
                </TableCell>
                <TableCell className="text-base font-semibold">
                  ₹{o.amount.toFixed(0)}
                </TableCell>
                <TableCell>
                  <Badge className={paymentBadgeClass(o.paymentMethod)}>
                    {o.paymentMethod}
                  </Badge>
                </TableCell>
                <TableCell className="text-base">
                  {o.expenseAmount ? `₹${o.expenseAmount.toFixed(0)}` : "—"}
                </TableCell>
                <TableCell>
                  {o.expensePaymentMethod ? (
                    <Badge className={paymentBadgeClass(o.expensePaymentMethod)}>
                      {o.expensePaymentMethod}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <OrderActions order={o} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {orders.map((o) => (
          <div key={o.id} className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[#111827]">
                  {o.customerName || "Walk-in Customer"}
                </p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  {formatTime(o.createdAt)}
                </p>
              </div>
              <p className="text-2xl font-bold text-[#111827]">
                ₹{o.amount.toFixed(0)}
              </p>
            </div>

            <p className="mt-3 text-base text-[#111827]">{o.itemsOrdered}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className={sourceBadgeClass(o.source)}>{o.source}</Badge>
              <Badge className={paymentBadgeClass(o.paymentMethod)}>
                {o.paymentMethod}
              </Badge>
              {o.expenseAmount ? (
                <Badge className="bg-amber-100 text-amber-700">
                  Expense ₹{o.expenseAmount.toFixed(0)}
                  {o.expensePaymentMethod ? ` (${o.expensePaymentMethod})` : ""}
                </Badge>
              ) : null}
            </div>

            <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
              <OrderActions order={o} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
