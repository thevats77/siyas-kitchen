import Link from "next/link";
import { formatDateIST, getISTHour } from "@/lib/date";

function getGreeting() {
  const hour = getISTHour();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getToday() {
  return formatDateIST(new Date());
}

export function DashboardHeader() {
  return (
    <div className="pt-8 pb-2">
      <h1 className="text-3xl font-bold text-[#111827]">🍽️ Siya&apos;s Kitchen</h1>
      <p className="mt-1 text-lg text-[#6B7280]">Today&apos;s Business</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#111827] shadow-sm">
          {getGreeting()}
        </span>
        <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#6B7280] shadow-sm">
          {getToday()}
        </span>
        <Link
          href="/history"
          className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#3B82F6] shadow-sm"
        >
          Order History
        </Link>
      </div>
    </div>
  );
}
