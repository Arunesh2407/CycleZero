<div align="center">

# 🛡️ Subscription Guardian

### *Personal Finance & Recurring Spend Control Dashboard*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.168-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/start/latest)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<p align="center">
  A full-stack, server-authoritative recurring SaaS & streaming subscription tracker that normalizes annual costs, predicts 12-month cash-flow burn, and alerts you before upcoming renewal dates.
</p>

</div>

---

## 🌟 Key Features

- **⚡ Server-Authoritative Architecture**: All cost normalization (`cost / 12` for yearly plans), renewal date calculations, and metric aggregations are computed on the backend—never in client React state.
- **📊 Spend Intelligence & Forecast**:
  - **Category Breakdown**: Interactive donut chart visualizing monthly spend distribution by category (Entertainment, Developer Tools, Productivity, etc.).
  - **12-Month Cash Flow Projection**: Smooth area chart forecasting projected subscription cash flow burn over the next 12 months.
- **⚠️ Smart Renewal Alerts**: Automatic evaluation of renewal dates against UTC server time, displaying an amber caution badge (`Renewing Soon`) for subscriptions renewing within 7 days.
- **💡 Real-time Savings Simulator**: Toggling a subscription to `PAUSED` instantly greys out the table row and recalculates top dashboard metrics (exposes simulated monthly savings without deleting records).
- **📅 iCalendar (.ics) Sync**: One-click export to download a `.ics` calendar file to import renewal reminders directly into Google Calendar, Apple Calendar, or Outlook.
- **🔍 Instant Search & Filtering**: Client-side quick search by service name or category filter dropdown.

---

## 🏗️ Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Frontend                        │
│   (TanStack Router + React 19 + Tailwind CSS v4 + Recharts) │
└──────────────┬──────────────────────────────▲───────────────┘
               │                              │
               │ Server Functions (RPC)       │ JSON Payload
               ▼                              │
┌─────────────────────────────────────────────┴───────────────┐
│                   Server-Side Backend                       │
│    (TanStack Start Server Handlers + Server Engine)         │
│  - Cost Uniformity Engine (Annual -> Monthly Normalization) │
│  - Date Intersect Calculator (Days Remaining Countdown)     │
│  - Metrics Aggregator (Burn Rate & Savings Calculation)     │
└──────────────┬──────────────────────────────▲───────────────┘
               │                              │
               │ SQL Queries / RLS            │ Postgres Records
               ▼                              │
┌─────────────────────────────────────────────┴───────────────┐
│                   Supabase Database                         │
│           (Postgres Table `public.subscriptions`)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Dashboard Metrics Overview

| Metric Card | Description | Calculation Logic |
| :--- | :--- | :--- |
| **Total Monthly Burn Rate** | Normalized monthly expenditure | $\sum \text{normalizedMonthlyCost}$ for all `ACTIVE` subscriptions |
| **Upcoming Renewals** | Alert counter for urgent renewals | Count of `ACTIVE` subscriptions where $0 \le \text{daysRemaining} \le 7$ |
| **Simulated Monthly Savings** | Real-time freed-up budget | $\sum \text{normalizedMonthlyCost}$ for all `PAUSED` subscriptions |

---

## 🚀 Quick Start & Development

### Prerequisites

- **Node.js** v20.0.0 or higher
- **npm** v10.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Arunesh2407/CycleZero.git
   cd CycleZero
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL="https://your-supabase-project.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
   SUPABASE_URL="https://your-supabase-project.supabase.co"
   SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
   ```

4. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── subscriptions/
│   │   │   ├── AnalyticsCharts.tsx    # Donut & 12-Month Projection charts
│   │   │   ├── MetricsBar.tsx         # Top summary stat cards
│   │   │   ├── SubscriptionForm.tsx   # Add subscription form input
│   │   │   └── SubscriptionTable.tsx  # Filterable grid with toggle & iCal export
│   │   └── ui/                       # Reusable Radix UI components
│   ├── integrations/supabase/        # Supabase client & type definitions
│   ├── lib/
│   │   ├── ical-generator.ts          # .ics iCalendar file generator
│   │   ├── subscriptions.functions.ts # TanStack Start server functions
│   │   ├── subscriptions.server.ts    # Server engine logic & metric aggregations
│   │   └── subscriptions.types.ts     # TypeScript DTOs & payloads
│   └── routes/
│       ├── __root.tsx                 # HTML shell & metadata
│       └── index.tsx                  # Main dashboard page route
├── supabase/
│   └── migrations/                    # SQL Schema & pre-populated seed data
├── public/
│   └── favicon.svg                    # App favicon
└── vite.config.ts                     # Vite + TanStack Start configuration
```

---

<div align="center">

Crafted with ❤️ for complete control over recurring software subscriptions.

</div>
