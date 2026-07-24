"use client";

import { useRouter } from "next/navigation";
import { FILTER_OPTIONS, type DashboardFilter } from "@/lib/date";
import { cn } from "@/lib/utils";

export function DashboardFilterTabs({ active }: { active: DashboardFilter }) {
  const router = useRouter();

  function setFilter(value: DashboardFilter) {
    router.push(`/dashboard?filter=${value}`);
  }

  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => setFilter(option.value)}
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-colors",
            active === option.value
              ? "bg-[#22C55E] text-white"
              : "bg-white text-[#6B7280] hover:text-[#111827]"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
