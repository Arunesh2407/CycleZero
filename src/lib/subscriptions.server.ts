import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type {
  BillingCycle,
  DashboardPayload,
  SubscriptionDTO,
  SubscriptionStatus,
} from "./subscriptions.types";

export type { BillingCycle, DashboardPayload, SubscriptionDTO, SubscriptionStatus };

export interface SubscriptionRow {
  id: string;
  service_name: string;
  cost: number | string;
  billing_cycle: BillingCycle;
  next_renewal_date: string;
  category: string;
  status: SubscriptionStatus;
  created_at: string;
}


export function getServerSupabase() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const DAY_MS = 1000 * 60 * 60 * 24;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function decorate(row: SubscriptionRow, now: Date): SubscriptionDTO {
  const cost = Number(row.cost);
  const normalizedMonthlyCost =
    row.billing_cycle === "Yearly" ? round2(cost / 12) : round2(cost);

  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const [y, m, d] = row.next_renewal_date.split("-").map(Number);
  const renewal = Date.UTC(y!, (m ?? 1) - 1, d ?? 1);
  const daysRemaining = Math.ceil((renewal - today) / DAY_MS);

  return {
    id: row.id,
    serviceName: row.service_name,
    cost,
    billingCycle: row.billing_cycle,
    nextRenewalDate: row.next_renewal_date,
    category: row.category,
    status: row.status,
    createdAt: row.created_at,
    normalizedMonthlyCost,
    daysRemaining,
    isRenewingSoon: daysRemaining >= 0 && daysRemaining <= 7,
  };
}

export async function buildDashboard(): Promise<DashboardPayload> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("next_renewal_date", { ascending: true });

  if (error) throw new Error(error.message);

  const now = new Date();
  const subscriptions = ((data ?? []) as SubscriptionRow[]).map((r) => decorate(r, now));

  const active = subscriptions.filter((s) => s.status === "ACTIVE");
  const paused = subscriptions.filter((s) => s.status === "PAUSED");

  return {
    subscriptions,
    metrics: {
      totalMonthlyBurnRate: round2(
        active.reduce((sum, s) => sum + s.normalizedMonthlyCost, 0),
      ),
      upcomingRenewalsCount: active.filter((s) => s.isRenewingSoon).length,
      simulatedMonthlySavings: round2(
        paused.reduce((sum, s) => sum + s.normalizedMonthlyCost, 0),
      ),
    },
    serverDate: now.toISOString(),
  };
}
