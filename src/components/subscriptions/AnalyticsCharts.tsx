import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import type { DashboardPayload } from "@/lib/subscriptions.types";

const COLORS = [
  "#6366f1", // indigo
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ec4899", // pink
  "#8b5cf6", // purple
  "#64748b", // slate
];

const currency = (val: number) =>
  val.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function AnalyticsCharts({ metrics }: { metrics: DashboardPayload["metrics"] }) {
  const [activeTab, setActiveTab] = useState<"category" | "projection">("category");

  const categoryData = (metrics.categorySpend || []).map((cat, idx) => ({
    name: cat.category,
    value: cat.monthlySpend,
    count: cat.count,
    percentage: cat.percentage,
    color: COLORS[idx % COLORS.length],
  }));

  const projectionData = metrics.twelveMonthProjection || [];

  return (
    <div className="surface-panel p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Spend Intelligence &amp; Forecast
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Server-calculated allocation across categories and 12-month projected cash flow.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-border bg-secondary/50 p-1">
          <button
            onClick={() => setActiveTab("category")}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "category"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PieChartIcon className="size-4" />
            Category Breakdown
          </button>
          <button
            onClick={() => setActiveTab("projection")}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "projection"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="size-4" />
            12-Month Projection
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "category" ? (
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="h-72 w-full lg:col-span-6">
              {categoryData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No active subscriptions to display.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [currency(val), "Monthly Burn"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                        color: "hsl(var(--popover-foreground))",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="space-y-4 lg:col-span-6">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm py-1 border-b border-border/40 last:border-0">
                  <div className="flex items-center gap-3">
                    <span
                      className="size-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-semibold text-foreground text-sm">{cat.name}</span>
                    <span className="text-xs text-muted-foreground font-medium">
                      ({cat.count} sub{cat.count === 1 ? "" : "s"})
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="font-bold text-foreground text-sm sm:text-base">
                      {currency(cat.value)}/mo
                    </span>
                    <span className="rounded bg-secondary/80 px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 13, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 13, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(val: number) => [currency(val), "Projected Spend"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                    color: "hsl(var(--popover-foreground))",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#spendGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
