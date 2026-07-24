import { ReceiptText, IndianRupee, Wallet, Smartphone } from "lucide-react";
import { FILTER_OPTIONS, type DashboardFilter } from "@/lib/date";

function periodLabel(filter?: DashboardFilter) {
  if (!filter) return "Today's";
  const option = FILTER_OPTIONS.find((o) => o.value === filter);
  return option ? option.label : "Today's";
}

function StatCard({
  icon,
  label,
  value,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-[#6B7280]">{label}</p>
      <p className="mt-1 text-3xl font-bold text-[#111827]">{value}</p>
    </div>
  );
}

export function StatCards({
  stats,
  filter,
}: {
  stats: {
    count: number;
    totalSales: number;
    cashReceived: number;
    upiReceived: number;
  };
  filter?: DashboardFilter;
}) {
  const label = periodLabel(filter);
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        icon={<ReceiptText className="h-6 w-6" />}
        label={`${label} Orders`}
        value={String(stats.count)}
        iconBg="bg-green-50"
        iconColor="text-[#22C55E]"
      />
      <StatCard
        icon={<IndianRupee className="h-6 w-6" />}
        label={`${label} Sales`}
        value={`₹${stats.totalSales.toFixed(0)}`}
        iconBg="bg-blue-50"
        iconColor="text-[#3B82F6]"
      />
      <StatCard
        icon={<Wallet className="h-6 w-6" />}
        label="Cash Received"
        value={`₹${stats.cashReceived.toFixed(0)}`}
        iconBg="bg-green-50"
        iconColor="text-[#22C55E]"
      />
      <StatCard
        icon={<Smartphone className="h-6 w-6" />}
        label="UPI Received"
        value={`₹${stats.upiReceived.toFixed(0)}`}
        iconBg="bg-blue-50"
        iconColor="text-[#3B82F6]"
      />
    </div>
  );
}
