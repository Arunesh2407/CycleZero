import type { SubscriptionDTO } from "./subscriptions.types";

export function generateICalendar(subscriptions: SubscriptionDTO[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Subscription Guardian//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Subscription Renewals",
  ];

  const formatICalDate = (isoDate: string) => {
    // "2026-08-27" -> "20260827"
    return isoDate.replace(/-/g, "");
  };

  for (const sub of subscriptions) {
    if (sub.status !== "ACTIVE") continue;

    const dateStr = formatICalDate(sub.nextRenewalDate);
    const summary = `${sub.serviceName} Renewal ($${sub.cost.toFixed(2)})`;
    const description = `Subscription renewal reminder for ${sub.serviceName}. Cost: $${sub.cost.toFixed(2)} (${sub.billingCycle}). Category: ${sub.category}.`;

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:sub-${sub.id}@subscription-guardian`);
    lines.push(`SUMMARY:${summary}`);
    lines.push(`DESCRIPTION:${description}`);
    lines.push(`DTSTART;VALUE=DATE:${dateStr}`);
    lines.push(`DTEND;VALUE=DATE:${dateStr}`);
    lines.push("STATUS:CONFIRMED");
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICalendar(subscriptions: SubscriptionDTO[]) {
  const icsContent = generateICalendar(subscriptions);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "subscription-renewals.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
