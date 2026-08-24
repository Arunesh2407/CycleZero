import { AlarmClock, PiggyBank, Wallet } from "lucide-react";
import type { DashboardPayload } from "@/lib/subscriptions.types";

const currency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function MetricsBar({ metrics }: { metrics: DashboardPayload["metrics"] }) {
  const cards = [
    {
      label: "Total Monthly Burn Rate",
      value: currency(metrics.totalMonthlyBurnRate),
      hint: "Normalized across all active plans",
      icon: Wallet,
      tone: "text-foreground",
      ring: "bg-secondary text-foreground",
    },
    {
      label: "Upcoming Renewals",
      value: String(metrics.upcomingRenewalsCount),
      hint: "Active plans renewing within 7 days",
      icon: AlarmClock,
      tone: "text-warning",
      ring: "bg-warning/15 text-warning",
    },
    {
      label: "Simulated Monthly Savings",
      value: currency(metrics.simulatedMonthlySavings),
      hint: "Freed up by paused subscriptions",
      icon: PiggyBank,
      tone: "text-success",
      ring: "bg-success/15 text-success",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="surface-panel p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-muted-foreground">{card.label}</p>
            <span className={`rounded-lg p-2 ${card.ring}`}>
              <card.icon className="size-4" />
            </span>
          </div>
          <p className={`mt-3 text-3xl font-bold tracking-tight ${card.tone}`}>
            {card.value}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
