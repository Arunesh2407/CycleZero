import { useState } from "react";
import { CalendarIcon, Check, Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BillingCycle } from "@/lib/subscriptions.types";

export interface NewSubscriptionInput {
  serviceName: string;
  cost: number;
  billingCycle: BillingCycle;
  nextRenewalDate: string;
  category: string;
}

const DEFAULT_CATEGORIES = [
  "Entertainment",
  "Developer Tools",
  "Design",
  "Productivity",
  "Infrastructure",
  "Utilities",
  "Health & Fitness",
  "Finance",
  "Other",
];

const emptyForm = {
  serviceName: "",
  cost: "",
  billingCycle: "Monthly" as BillingCycle,
  nextRenewalDate: "",
  category: "Entertainment",
  customCategory: "",
  isCustomCategory: false,
};

export function SubscriptionForm({
  onSubmit,
  isPending,
}: {
  onSubmit: (input: NewSubscriptionInput) => Promise<unknown>;
  isPending: boolean;
}) {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleCategoryChange = (value: string) => {
    if (value === "__CUSTOM__") {
      setForm({ ...form, isCustomCategory: true, customCategory: "" });
    } else {
      setForm({ ...form, category: value, isCustomCategory: false });
    }
  };

  const handleAddCustomCategory = () => {
    const trimmed = form.customCategory.trim();
    if (!trimmed) return;
    if (!categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
    }
    setForm({
      ...form,
      category: trimmed,
      isCustomCategory: false,
      customCategory: "",
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      setForm((prev) => ({ ...prev, nextRenewalDate: dateStr }));
      setIsCalendarOpen(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cost = Number(form.cost);
    const finalCategory = form.isCustomCategory
      ? form.customCategory.trim() || "Other"
      : form.category;

    if (!form.serviceName.trim() || !form.nextRenewalDate || Number.isNaN(cost)) return;

    await onSubmit({
      serviceName: form.serviceName.trim(),
      cost,
      billingCycle: form.billingCycle,
      nextRenewalDate: form.nextRenewalDate,
      category: finalCategory,
    });

    setForm(emptyForm);
    setSelectedDate(undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="surface-panel p-6">
      <h2 className="text-lg font-bold tracking-tight text-foreground">Add a subscription</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Costs are normalized and evaluated on the server.
      </p>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="serviceName" className="text-sm font-semibold">
            Service name
          </Label>
          <Input
            id="serviceName"
            value={form.serviceName}
            placeholder="Spotify, Netflix..."
            onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost" className="text-sm font-semibold">
            Cost ($)
          </Label>
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
          <Label htmlFor="billingCycle" className="text-sm font-semibold">
            Billing cycle
          </Label>
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
          <Label className="text-sm font-semibold">Next renewal</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 size-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-semibold">
            Category
          </Label>
          {form.isCustomCategory ? (
            <div className="flex gap-2">
              <Input
                placeholder="Enter custom category..."
                value={form.customCategory}
                onChange={(e) =>
                  setForm({ ...form, customCategory: e.target.value })
                }
                autoFocus
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={handleAddCustomCategory}
                title="Save category"
              >
                <Check className="size-4" />
              </Button>
            </div>
          ) : (
            <Select
              value={form.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="__CUSTOM__" className="text-primary font-semibold">
                  + Add Custom Category...
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Button type="submit" disabled={isPending} className="font-semibold">
          <Plus className="size-4" />
          {isPending ? "Saving..." : "Add subscription"}
        </Button>
      </div>
    </form>
  );
}
