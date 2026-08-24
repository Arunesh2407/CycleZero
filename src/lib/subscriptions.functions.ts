import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createSchema = z.object({
  serviceName: z.string().trim().min(1).max(80),
  cost: z.number().nonnegative().max(1_000_000),
  billingCycle: z.enum(["Monthly", "Yearly"]),
  nextRenewalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string().trim().min(1).max(60),
});

export const getDashboard = createServerFn({ method: "GET" }).handler(async () => {
  const { buildDashboard } = await import("./subscriptions.server");
  return buildDashboard();
});

export const createSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data }) => {
    const { getServerSupabase, buildDashboard } = await import("./subscriptions.server");
    const { error } = await getServerSupabase().from("subscriptions").insert({
      service_name: data.serviceName,
      cost: data.cost,
      billing_cycle: data.billingCycle,
      next_renewal_date: data.nextRenewalDate,
      category: data.category,
      status: "ACTIVE",
    });
    if (error) throw new Error(error.message);
    return buildDashboard();
  });

export const setSubscriptionStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["ACTIVE", "PAUSED"]) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { getServerSupabase, buildDashboard } = await import("./subscriptions.server");
    const { error } = await getServerSupabase()
      .from("subscriptions")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return buildDashboard();
  });

export const deleteSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { getServerSupabase, buildDashboard } = await import("./subscriptions.server");
    const { error } = await getServerSupabase()
      .from("subscriptions")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return buildDashboard();
  });
