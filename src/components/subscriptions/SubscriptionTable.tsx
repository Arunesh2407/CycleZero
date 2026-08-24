import { useMemo, useState } from "react";
import { AlertTriangle, Calendar, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadICalendar } from "@/lib/ical-generator";
import type { SubscriptionDTO, SubscriptionStatus } from "@/lib/subscriptions.types";

const currency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, (m ?? 1) - 1, d ?? 1)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

function DaysLeftTag({ days }: { days: number }) {
  if (days < 0) return <Badge variant="outline">Overdue</Badge>;
  if (days === 0) return <Badge variant="destructive">Today</Badge>;
  return (
    <Badge variant="secondary">
      {days} day{days === 1 ? "" : "s"} left
    </Badge>
  );
}

export function SubscriptionTable({
  subscriptions,
  onToggleStatus,
  onDelete,
  isPending,
}: {
  subscriptions: SubscriptionDTO[];
  onToggleStatus: (id: string, status: SubscriptionStatus) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = useMemo(() => {
    const set = new Set<string>();
    subscriptions.forEach((s) => set.add(s.category));
    return Array.from(set).sort();
  }, [subscriptions]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch =
        sub.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        sub.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || sub.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [subscriptions, search, selectedCategory]);

  return (
    <div className="surface-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold">Subscriptions</h2>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
            {filteredSubscriptions.length} of {subscriptions.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search subscription..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadICalendar(subscriptions)}
            className="text-xs"
            title="Download .ics file for Google Calendar, Apple Calendar & Outlook"
          >
            <Calendar className="size-3.5" />
            Export iCal (.ics)
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Original price</TableHead>
              <TableHead>Monthly burn</TableHead>
              <TableHead>Renewal date</TableHead>
              <TableHead>Days left</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  {subscriptions.length === 0
                    ? "No subscriptions yet — add one above."
                    : "No subscriptions match your search or filter."}
                </TableCell>
              </TableRow>
            )}

            {filteredSubscriptions.map((sub) => {
              const paused = sub.status === "PAUSED";
              return (
                <TableRow
                  key={sub.id}
                  className={paused ? "opacity-50 text-muted-foreground" : undefined}
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-wrap items-center gap-2">
                      {sub.serviceName}
                      {!paused && sub.isRenewingSoon && (
                        <Badge className="border-warning/40 bg-warning/15 text-warning">
                          <AlertTriangle className="size-3" />
                          Renewing Soon
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sub.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {currency(sub.cost)}
                    <span className="text-muted-foreground"> / {sub.billingCycle}</span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {currency(sub.normalizedMonthlyCost)}
                  </TableCell>
                  <TableCell>{formatDate(sub.nextRenewalDate)}</TableCell>
                  <TableCell>
                    <DaysLeftTag days={sub.daysRemaining} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!paused}
                        disabled={isPending}
                        aria-label={`Toggle ${sub.serviceName} status`}
                        onCheckedChange={(checked) =>
                          onToggleStatus(sub.id, checked ? "ACTIVE" : "PAUSED")
                        }
                      />
                      <Badge
                        className={
                          paused
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/15 text-primary border-primary/30"
                        }
                      >
                        {sub.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      aria-label={`Delete ${sub.serviceName}`}
                      onClick={() => onDelete(sub.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
