import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BillingCycle } from "@/lib/subscriptions.types";

export interface NewSubscriptionInput {
  serviceName: string;
  cost: number;
  billingCycle: BillingCycle;
  nextRenewalDate: string;
  category: string;
}

const emptyForm = {
  serviceName: "",
  cost: "",
  billingCycle: "Monthly" as BillingCycle,
  nextRenewalDate: "",
  category: "",
};

export function SubscriptionForm({
  onSubmit,
  isPending,
}: {
  onSubmit: (input: NewSubscriptionInput) => Promise<unknown>;
  isPending: boolean;
}) {
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cost = Number(form.cost);
    if (!form.serviceName.trim() || !form.nextRenewalDate || Number.isNaN(cost)) return;
    await onSubmit({
      serviceName: form.serviceName.trim(),
      cost,
      billingCycle: form.billingCycle,
      nextRenewalDate: form.nextRenewalDate,
      category: form.category.trim() || "Other",
    });
    setForm(emptyForm);
  };

  return (
    <form onSubmit={handleSubmit} className="surface-panel p-5">
      <h2 className="text-base font-semibold">Add a subscription</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Costs are normalized and evaluated on the server.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="serviceName">Service name</Label>
          <Input
            id="serviceName"
            value={form.serviceName}
            placeholder="Spotify"
            onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Cost</Label>
          <Input
            id="cost"
            type="number"
            min="0"
            step="0.01"
            value={form.cost}
            placeholder="9.99"
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="billingCycle">Billing cycle</Label>
          <Select
            value={form.billingCycle}
            onValueChange={(value) =>
              setForm({ ...form, billingCycle: value as BillingCycle })
            }
          >
            <SelectTrigger id="billingCycle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nextRenewalDate">Next renewal</Label>
          <Input
            id="nextRenewalDate"
            type="date"
            value={form.nextRenewalDate}
            onChange={(e) => setForm({ ...form, nextRenewalDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={form.category}
            placeholder="Entertainment"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isPending}>
          <Plus className="size-4" />
          {isPending ? "Saving..." : "Add subscription"}
        </Button>
      </div>
    </form>
  );
}
