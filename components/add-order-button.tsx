"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  ResponsiveSheet,
  ResponsiveSheetTrigger,
  ResponsiveSheetContent,
} from "@/components/ui/responsive-sheet";
import { OrderForm } from "@/components/order-form";

export function AddOrderButton() {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveSheet open={open} onOpenChange={setOpen}>
      <ResponsiveSheetTrigger asChild>
        <button
          aria-label="Add Order"
          className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-lg shadow-green-900/20 active:scale-95 transition-transform sm:bottom-10 sm:right-10"
        >
          <Plus className="h-8 w-8" strokeWidth={2.5} />
        </button>
      </ResponsiveSheetTrigger>
      <ResponsiveSheetContent title="Add Order">
        <OrderForm onDone={() => setOpen(false)} />
      </ResponsiveSheetContent>
    </ResponsiveSheet>
  );
}
