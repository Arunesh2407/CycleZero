import { AlertTriangle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  return (
    <div className="surface-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold">Subscriptions</h2>
        <span className="text-xs text-muted-foreground">
          {subscriptions.length} tracked
        </span>
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
            {subscriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  No subscriptions yet — add one above.
                </TableCell>
              </TableRow>
            )}

            {subscriptions.map((sub) => {
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
