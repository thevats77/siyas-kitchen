"use client";

import { useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveSheet,
  ResponsiveSheetTrigger,
  ResponsiveSheetContent,
} from "@/components/ui/responsive-sheet";
import { OrderForm, type OrderFormValues } from "@/components/order-form";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { deleteOrder } from "@/lib/actions/order";

export type OrderRow = {
  id: string;
  customerName: string | null;
  itemsOrdered: string;
  amount: number;
  source: string;
  paymentMethod: string;
  expenseAmount: number | null;
  expensePaymentMethod: string | null;
};

export function OrderActions({ order }: { order: OrderRow }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const initialValues: OrderFormValues = {
    customerName: order.customerName ?? "",
    itemsOrdered: order.itemsOrdered,
    amount: String(order.amount),
    source: order.source,
    paymentMethod: order.paymentMethod,
    expenseAmount: order.expenseAmount ? String(order.expenseAmount) : "",
    expensePaymentMethod: order.expensePaymentMethod ?? "Cash",
  };

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteOrder(order.id);
      toast.success("Order Deleted");
    } catch {
      toast.error("Could not delete order. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <ResponsiveSheet open={editOpen} onOpenChange={setEditOpen}>
        <ResponsiveSheetTrigger asChild>
          <button
            aria-label="Edit Order"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#3B82F6] active:bg-blue-100"
          >
            <Pencil className="h-5 w-5" />
          </button>
        </ResponsiveSheetTrigger>
        <ResponsiveSheetContent title="Edit Order">
          <OrderForm
            orderId={order.id}
            initialValues={initialValues}
            onDone={() => setEditOpen(false)}
          />
        </ResponsiveSheetContent>
      </ResponsiveSheet>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            aria-label="Delete Order"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#EF4444] active:bg-red-100"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The order will be removed permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
