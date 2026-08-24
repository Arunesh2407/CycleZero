# Subscription Guardian

Create a full-stack "Subscription Tracker & Renewal Dashboard" application adhering strictly to a server-authoritative architecture where all business logic, date calculations, and metric aggregations are computed on the backend (Supabase Edge Functions / Serverless API routes), NOT in client-side React state.
1. Backend Data Model & Server Logic:
- Subscription Entity: `id`, `serviceName` (text), `cost` (numeric), `billingCycle` ('Monthly' | 'Yearly'), `nextRenewalDate` (date), `category` (text), `status` ('ACTIVE' | 'PAUSED'), `createdAt` (timestamp).
- Cost Uniformity Engine (Server-side):
  * If billingCycle === 'Yearly', calculate normalizedMonthlyCost = cost / 12.
  * If billingCycle === 'Monthly', normalizedMonthlyCost = cost.
- Date Intersect Calculator (Server-side):
  * Calculate daysRemaining = ceil((renewalDate - serverCurrentDate) / (1000 * 60 * 60 * 24)).
  * If daysRemaining is between 0 and 7 (inclusive), flag `isRenewingSoon = true`.
- Metrics Aggregator (Server-side):
  * Total Monthly Burn Rate: Sum of normalizedMonthlyCost for all 'ACTIVE' subscriptions.
  * Upcoming Renewals Alert Count: Count of 'ACTIVE' subscriptions where isRenewingSoon === true.
  * Simulated Monthly Savings: Sum of normalizedMonthlyCost for all 'PAUSED' subscriptions.
- Server Seed Data: Automatically pre-populate 4-5 mock subscriptions (e.g., Netflix monthly renewing in 3 days, GitHub Copilot yearly renewing in 5 days, Figma monthly renewing in 20 days, AWS monthly paused) so the dashboard immediately renders valid data.
2. Frontend UI & Experience:
- Metrics Bar (Top): 3 summary stat cards displaying Total Monthly Burn Rate ($), Upcoming Renewals Alert Count (warning amber counter), and Simulated Monthly Savings (green).
- Entry Form:
  * Clean form with inputs for Service Name, Cost, Billing Cycle dropdown (Monthly/Yearly), Next Renewal Date picker, and Category.
  * Submitting makes a server request; metrics and table update from the server response.
- Subscription Grid Table:
  * Columns: Service Name, Category Badge, Original Price & Cycle, Monthly Normalized Burn, Renewal Date, Days Left Tag, Status Badge, and Actions.
  * Visual Alert: If isRenewingSoon is true, show an amber caution badge reading "Renewing Soon".
  * Active / Paused Toggle: Switching to "PAUSED" must NOT delete the record; it must trigger a server update, instantly grey out that table row visually (opacity-50 / muted styling), and update the burn rate metrics.
  * Include a separate Delete action button to permanently remove entries.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
