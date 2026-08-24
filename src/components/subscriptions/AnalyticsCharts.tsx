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
    <div className="surface-panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-base font-semibold">Spend Intelligence &amp; Forecast</h2>
          <p className="text-xs text-muted-foreground">
            Server-calculated allocation across categories and 12-month projected cash flow.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-border bg-secondary/50 p-1">
          <button
            onClick={() => setActiveTab("category")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "category"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PieChartIcon className="size-3.5" />
            Category Breakdown
          </button>
          <button
            onClick={() => setActiveTab("projection")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "projection"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="size-3.5" />
            12-Month Projection
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "category" ? (
          <div className="grid items-center gap-6 lg:grid-cols-12">
            <div className="h-64 w-full lg:col-span-6">
              {categoryData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No active subscriptions to display.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
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
                        fontSize: "0.75rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="space-y-3 lg:col-span-6">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-medium text-foreground">{cat.name}</span>
                    <span className="text-muted-foreground">
                      ({cat.count} sub{cat.count === 1 ? "" : "s"})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-foreground">
                      {currency(cat.value)}/mo
                    </span>
                    <span className="ml-2 text-muted-foreground">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(val: number) => [currency(val), "Projected Spend"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                    color: "hsl(var(--popover-foreground))",
                    fontSize: "0.75rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="#6366f1"
                  strokeWidth={2.5}
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
