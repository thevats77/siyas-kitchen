"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export const ResponsiveSheet = DialogPrimitive.Root;
export const ResponsiveSheetTrigger = DialogPrimitive.Trigger;

export function ResponsiveSheetContent({
  className,
  children,
  title,
}: {
  className?: string;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col bg-white shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "inset-x-0 bottom-0 top-0 rounded-none",
          "sm:inset-auto sm:left-[50%] sm:top-[50%] sm:h-auto sm:max-h-[85vh] sm:w-[92vw] sm:max-w-lg sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-3xl",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0",
          className
        )}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
          <DialogPrimitive.Title className="text-2xl font-semibold text-[#111827]">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-[#6B7280] active:bg-gray-200">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto px-6">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
