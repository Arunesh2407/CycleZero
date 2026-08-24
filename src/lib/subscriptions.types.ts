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

export interface DashboardPayload {
  subscriptions: SubscriptionDTO[];
  metrics: {
    totalMonthlyBurnRate: number;
    upcomingRenewalsCount: number;
    simulatedMonthlySavings: number;
  };
  serverDate: string;
}
