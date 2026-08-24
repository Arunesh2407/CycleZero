CREATE TYPE public.billing_cycle AS ENUM ('Monthly','Yearly');
CREATE TYPE public.subscription_status AS ENUM ('ACTIVE','PAUSED');

CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  cost NUMERIC(12,2) NOT NULL CHECK (cost >= 0),
  billing_cycle public.billing_cycle NOT NULL DEFAULT 'Monthly',
  next_renewal_date DATE NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  status public.subscription_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public demo read" ON public.subscriptions FOR SELECT USING (true);
CREATE POLICY "Public demo insert" ON public.subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public demo update" ON public.subscriptions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public demo delete" ON public.subscriptions FOR DELETE USING (true);

INSERT INTO public.subscriptions (service_name, cost, billing_cycle, next_renewal_date, category, status) VALUES
  ('Netflix', 15.49, 'Monthly', (CURRENT_DATE + 3), 'Entertainment', 'ACTIVE'),
  ('GitHub Copilot', 100.00, 'Yearly', (CURRENT_DATE + 5), 'Developer Tools', 'ACTIVE'),
  ('Figma', 12.00, 'Monthly', (CURRENT_DATE + 20), 'Design', 'ACTIVE'),
  ('Notion', 96.00, 'Yearly', (CURRENT_DATE + 45), 'Productivity', 'ACTIVE'),
  ('AWS', 42.30, 'Monthly', (CURRENT_DATE + 12), 'Infrastructure', 'PAUSED');