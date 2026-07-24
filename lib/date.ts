// Asia/Kolkata is a fixed UTC+5:30 offset (no DST), so we can do this with
// plain Date arithmetic — no extra timezone library required.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export type DashboardFilter = "today" | "yesterday" | "7days" | "month" | "all";

export const FILTER_OPTIONS: { value: DashboardFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7days", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
  { value: "all", label: "All Orders" },
];

export function isDashboardFilter(value: string | undefined): value is DashboardFilter {
  return FILTER_OPTIONS.some((o) => o.value === value);
}

/** Midnight (00:00:00.000) in IST, for the IST calendar day containing `date`, returned as a UTC Date. */
function istMidnightUtc(date: Date): Date {
  const shifted = new Date(date.getTime() + IST_OFFSET_MS);
  const y = shifted.getUTCFullYear();
  const m = shifted.getUTCMonth();
  const d = shifted.getUTCDate();
  // Midnight IST expressed in UTC terms = UTC midnight for that Y/M/D minus the IST offset.
  return new Date(Date.UTC(y, m, d, 0, 0, 0, 0) - IST_OFFSET_MS);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Returns the UTC `[gte, lt)` boundaries for a dashboard filter, where day
 * boundaries are computed against Asia/Kolkata, not the server's timezone.
 */
export function getFilterRangeUTC(
  filter: DashboardFilter,
  now: Date = new Date()
): { gte?: Date; lt?: Date } {
  const todayStartUtc = istMidnightUtc(now);

  switch (filter) {
    case "today":
      return { gte: todayStartUtc, lt: addDays(todayStartUtc, 1) };
    case "yesterday":
      return { gte: addDays(todayStartUtc, -1), lt: todayStartUtc };
    case "7days":
      // Last 7 days including today.
      return { gte: addDays(todayStartUtc, -6), lt: addDays(todayStartUtc, 1) };
    case "month": {
      const shifted = new Date(now.getTime() + IST_OFFSET_MS);
      const y = shifted.getUTCFullYear();
      const m = shifted.getUTCMonth();
      const monthStartUtc = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0) - IST_OFFSET_MS);
      return { gte: monthStartUtc, lt: addDays(todayStartUtc, 1) };
    }
    case "all":
      return {};
  }
}

export function formatDateIST(date: Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Short date, used as a group header on the History page (e.g. "24 July 2026"). */
export function formatGroupDateIST(date: Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTimeIST(date: Date): string {
  return new Date(date).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Current hour of day in IST (0-23), for greetings etc. */
export function getISTHour(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  const hourPart = parts.find((p) => p.type === "hour")?.value ?? "0";
  // en-IN + hour12:false can format midnight as "24"; normalize to 0.
  return Number(hourPart) % 24;
}

/** Groups a list of orders (must have createdAt) by their IST calendar date, newest date first. */
export function groupByISTDate<T extends { createdAt: Date }>(
  orders: T[]
): { dateKey: string; label: string; orders: T[] }[] {
  const groups = new Map<string, { label: string; orders: T[] }>();

  for (const order of orders) {
    const dateKey = new Date(order.createdAt).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    }); // YYYY-MM-DD, stable sort key
    const existing = groups.get(dateKey);
    if (existing) {
      existing.orders.push(order);
    } else {
      groups.set(dateKey, { label: formatGroupDateIST(order.createdAt), orders: [order] });
    }
  }

  return Array.from(groups.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([dateKey, { label, orders }]) => ({ dateKey, label, orders }));
}
