"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createOrder, updateOrder } from "@/lib/actions/order";

export type OrderFormValues = {
  customerName: string;
  itemsOrdered: string;
  amount: string;
  source: string;
  paymentMethod: string;
  expenseAmount: string;
  expensePaymentMethod: string;
};

const emptyValues: OrderFormValues = {
  customerName: "",
  itemsOrdered: "",
  amount: "",
  source: "Direct",
  paymentMethod: "Cash",
  expenseAmount: "",
  expensePaymentMethod: "Cash",
};

export function OrderForm({
  orderId,
  initialValues,
  onDone,
}: {
  orderId?: string;
  initialValues?: OrderFormValues;
  onDone: () => void;
}) {
  const [values, setValues] = useState<OrderFormValues>(
    initialValues ?? emptyValues
  );
  const [errors, setErrors] = useState<{ itemsOrdered?: string; amount?: string }>(
    {}
  );
  const [saving, setSaving] = useState(false);
  const firstFieldRef = useRef<HTMLTextAreaElement>(null);
  const isEdit = Boolean(orderId);

  useEffect(() => {
    const timer = setTimeout(() => firstFieldRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, []);

  function update<K extends keyof OrderFormValues>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const nextErrors: { itemsOrdered?: string; amount?: string } = {};
    if (!values.itemsOrdered.trim()) {
      nextErrors.itemsOrdered = "Please enter what was ordered";
    }
    const amountNumber = parseFloat(values.amount);
    if (!values.amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      nextErrors.amount = "Please enter a valid amount";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(addAnother: boolean) {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        customerName: values.customerName.trim(),
        itemsOrdered: values.itemsOrdered.trim(),
        amount: parseFloat(values.amount),
        source: values.source,
        paymentMethod: values.paymentMethod,
        expenseAmount: values.expenseAmount
          ? parseFloat(values.expenseAmount)
          : undefined,
        expensePaymentMethod: values.expenseAmount
          ? values.expensePaymentMethod
          : undefined,
      };

      if (isEdit && orderId) {
        await updateOrder(orderId, payload);
        toast.success("Order Updated Successfully");
        onDone();
      } else {
        await createOrder(payload);
        toast.success("Order Saved Successfully");
        if (addAnother) {
          setValues(emptyValues);
          setErrors({});
          firstFieldRef.current?.focus();
        } else {
          onDone();
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6 pb-6 pt-2">
        <div className="space-y-2">
          <Label className="text-base font-medium text-[#111827]">
            Customer Name
            <span className="ml-1 text-sm font-normal text-[#6B7280]">
              (Optional)
            </span>
          </Label>
          <Input
            className="h-14 text-lg rounded-2xl border-gray-200"
            value={values.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            placeholder="e.g. Priya"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium text-[#111827]">
            Items Ordered
          </Label>
          <Textarea
            ref={firstFieldRef}
            className="text-lg rounded-2xl border-gray-200 min-h-[110px]"
            value={values.itemsOrdered}
            onChange={(e) => update("itemsOrdered", e.target.value)}
            placeholder="e.g. 2 Paneer Thali, 1 Lassi"
          />
          {errors.itemsOrdered && (
            <p className="text-sm font-medium text-[#EF4444]">
              {errors.itemsOrdered}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium text-[#111827]">
            Order Amount
          </Label>
          <Input
            className="h-14 text-lg rounded-2xl border-gray-200"
            type="number"
            inputMode="decimal"
            value={values.amount}
            onChange={(e) => update("amount", e.target.value)}
            placeholder="₹0"
          />
          {errors.amount && (
            <p className="text-sm font-medium text-[#EF4444]">{errors.amount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium text-[#111827]">
            Order Source
          </Label>
          <Select
            value={values.source}
            onValueChange={(v) => update("source", v)}
          >
            <SelectTrigger className="h-14 text-lg rounded-2xl border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Swiggy" className="text-lg h-12">
                Swiggy
              </SelectItem>
              <SelectItem value="Zomato" className="text-lg h-12">
                Zomato
              </SelectItem>
              <SelectItem value="Direct" className="text-lg h-12">
                Direct
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium text-[#111827]">
            Payment Received Via
          </Label>
          <Select
            value={values.paymentMethod}
            onValueChange={(v) => update("paymentMethod", v)}
          >
            <SelectTrigger className="h-14 text-lg rounded-2xl border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash" className="text-lg h-12">
                Cash
              </SelectItem>
              <SelectItem value="UPI" className="text-lg h-12">
                UPI
              </SelectItem>
              <SelectItem value="Card" className="text-lg h-12">
                Card
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium text-[#111827]">
            Expense Amount
            <span className="ml-1 text-sm font-normal text-[#6B7280]">
              (Optional)
            </span>
          </Label>
          <Input
            className="h-14 text-lg rounded-2xl border-gray-200"
            type="number"
            inputMode="decimal"
            value={values.expenseAmount}
            onChange={(e) => update("expenseAmount", e.target.value)}
            placeholder="₹0"
          />
        </div>

        {values.expenseAmount && (
          <div className="space-y-2">
            <Label className="text-base font-medium text-[#111827]">
              Expense Payment Method
            </Label>
            <Select
              value={values.expensePaymentMethod}
              onValueChange={(v) => update("expensePaymentMethod", v)}
            >
              <SelectTrigger className="h-14 text-lg rounded-2xl border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash" className="text-lg h-12">
                  Cash
                </SelectItem>
                <SelectItem value="UPI" className="text-lg h-12">
                  UPI
                </SelectItem>
                <SelectItem value="Card" className="text-lg h-12">
                  Card
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 -mx-6 mt-auto flex flex-col gap-3 border-t border-gray-100 bg-white px-6 pb-6 pt-4">
        <Button
          className="h-16 w-full rounded-2xl bg-[#22C55E] text-xl font-semibold hover:bg-[#22C55E]/90"
          onClick={() => submit(false)}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Save Order"
          )}
        </Button>
        {!isEdit && (
          <Button
            variant="outline"
            className="h-14 w-full rounded-2xl text-lg font-medium border-gray-200"
            onClick={() => submit(true)}
            disabled={saving}
          >
            Save & Add Another
          </Button>
        )}
      </div>
    </div>
  );
}
