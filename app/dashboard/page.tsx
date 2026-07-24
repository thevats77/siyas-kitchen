import { getOrders, getStats } from "@/lib/actions/order";
import { DashboardHeader } from "@/components/dashboard-header";
import { StatCards } from "@/components/stat-cards";
import { RecentOrders } from "@/components/recent-orders";
import { AddOrderButton } from "@/components/add-order-button";
import { DashboardFilterTabs } from "@/components/dashboard-filter";
import { isDashboardFilter, type DashboardFilter } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter: DashboardFilter = isDashboardFilter(params.filter)
    ? params.filter
    : "today";

  const [stats, orders] = await Promise.all([
    getStats(filter),
    getOrders(filter),
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <DashboardHeader />

        <div className="mt-6 space-y-6">
          <DashboardFilterTabs active={filter} />

          <StatCards stats={stats} filter={filter} />

          <div>
            <h2 className="mb-4 text-xl font-semibold text-[#111827]">
              Recent Orders
            </h2>
            <RecentOrders orders={orders} />
          </div>
        </div>
      </div>

      <AddOrderButton />
    </div>
  );
}
