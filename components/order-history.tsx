import { RecentOrders, type OrderRow } from "@/components/recent-orders";
import { groupByISTDate } from "@/lib/date";

export function OrderHistory({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
        <span className="text-6xl">🍽️</span>
        <p className="mt-4 text-xl font-semibold text-[#111827]">
          No Orders Yet
        </p>
      </div>
    );
  }

  const groups = groupByISTDate(orders);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.dateKey}>
          <h3 className="mb-3 text-lg font-semibold text-[#111827]">
            {group.label}
          </h3>
          <RecentOrders orders={group.orders} />
        </div>
      ))}
    </div>
  );
}
