export type BillingCycle = "Monthly" | "Yearly";
export type SubscriptionStatus = "ACTIVE" | "PAUSED";

export interface SubscriptionDTO {
  id: string;
  serviceName: string;
  cost: number;
  billingCycle: BillingCycle;
  nextRenewalDate: string;
  category: string;
  status: SubscriptionStatus;
  createdAt: string;
  normalizedMonthlyCost: number;
  daysRemaining: number;
  isRenewingSoon: boolean;
}

export interface CategorySpend {
  category: string;
  monthlySpend: number;
  count: number;
  percentage: number;
}

export interface MonthlyProjection {
  month: string;
  spend: number;
}

export interface DashboardPayload {
  subscriptions: SubscriptionDTO[];
  metrics: {
    totalMonthlyBurnRate: number;
    upcomingRenewalsCount: number;
    simulatedMonthlySavings: number;
    categorySpend: CategorySpend[];
    twelveMonthProjection: MonthlyProjection[];
  };
  serverDate: string;
}
