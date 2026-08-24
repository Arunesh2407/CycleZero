import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AnalyticsCharts } from "@/components/subscriptions/AnalyticsCharts";
import { MetricsBar } from "@/components/subscriptions/MetricsBar";
import {
  SubscriptionForm,
  type NewSubscriptionInput,
} from "@/components/subscriptions/SubscriptionForm";
import { SubscriptionTable } from "@/components/subscriptions/SubscriptionTable";
import {
  createSubscription,
  deleteSubscription,
  getDashboard,
  setSubscriptionStatus,
} from "@/lib/subscriptions.functions";
import type { DashboardPayload, SubscriptionStatus } from "@/lib/subscriptions.types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Subscription Tracker & Renewal Dashboard" },
      {
        name: "description",
        content:
          "Track recurring subscriptions, monitor your monthly burn rate, and catch renewals before they bill.",
      },
      { property: "og:title", content: "Subscription Tracker & Renewal Dashboard" },
      {
        property: "og:description",
        content:
          "Server-calculated burn rate, renewal alerts, and savings for every subscription you pay for.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getDashboard(),
  component: Dashboard,
});

function Dashboard() {
  const initial = Route.useLoaderData() as DashboardPayload;
  const queryClient = useQueryClient();

  const fetchDashboard = useServerFn(getDashboard);
  const addFn = useServerFn(createSubscription);
  const statusFn = useServerFn(setSubscriptionStatus);
  const deleteFn = useServerFn(deleteSubscription);

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
    initialData: initial,
  });

  const applyResult = (result: DashboardPayload) =>
    queryClient.setQueryData(["dashboard"], result);

  const addMutation = useMutation({
    mutationFn: (input: NewSubscriptionInput) => addFn({ data: input }),
    onSuccess: (result) => {
      applyResult(result as DashboardPayload);
      toast.success("Subscription added");
    },
    onError: () => toast.error("Could not add that subscription"),
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: SubscriptionStatus }) =>
      statusFn({ data: vars }),
    onSuccess: (result, vars) => {
      applyResult(result as DashboardPayload);
      toast.success(vars.status === "PAUSED" ? "Subscription paused" : "Subscription resumed");
    },
    onError: () => toast.error("Could not update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: (result) => {
      applyResult(result as DashboardPayload);
      toast.success("Subscription deleted");
    },
    onError: () => toast.error("Could not delete subscription"),
  });

  const busy =
    addMutation.isPending || statusMutation.isPending || deleteMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <header className="hero-gradient border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Recurring spend control
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Subscription Tracker &amp; Renewal Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every cost normalization, renewal countdown, and metric on this page is
            calculated on the server.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <MetricsBar metrics={data.metrics} />
        <AnalyticsCharts metrics={data.metrics} />
        <SubscriptionForm
          isPending={addMutation.isPending}
          onSubmit={(input) => addMutation.mutateAsync(input)}
        />
        <SubscriptionTable
          subscriptions={data.subscriptions}
          isPending={busy}
          onToggleStatus={(id, status) => statusMutation.mutate({ id, status })}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </main>
      <Toaster />
    </div>
  );
}
