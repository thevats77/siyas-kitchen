import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getOrders } from "@/lib/actions/order";
import { OrderHistory } from "@/components/order-history";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const orders = await getOrders("all");

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="pt-8 pb-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#6B7280]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-[#111827]">
            Order History
          </h1>
        </div>

        <div className="mt-6">
          <OrderHistory orders={orders} />
        </div>
      </div>
    </div>
  );
}
