-- Pulso — Initial Schema
-- Run in Supabase SQL editor or via: supabase db push

-- Full diagnostic record: stores responses + computed result
-- Only created after the user provides their email (gate)
CREATE TABLE IF NOT EXISTS diagnostics (
  id        UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email     TEXT        NOT NULL,
  responses JSONB       NOT NULL,   -- { "1": "Sí", "2": "No", ... }
  score     INTEGER     NOT NULL CHECK (score BETWEEN 0 AND 100),
  level     TEXT        NOT NULL,   -- Crítico | En riesgo | Estable | Saludable
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lightweight lead record for CRM / email campaigns
CREATE TABLE IF NOT EXISTS leads (
  id        UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email     TEXT        NOT NULL,
  score     INTEGER     NOT NULL CHECK (score BETWEEN 0 AND 100),
  level     TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common dashboard queries
CREATE INDEX IF NOT EXISTS diagnostics_email_idx   ON diagnostics (email);
CREATE INDEX IF NOT EXISTS diagnostics_score_idx   ON diagnostics (score);
CREATE INDEX IF NOT EXISTS diagnostics_created_idx ON diagnostics (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx         ON leads (email);
CREATE INDEX IF NOT EXISTS leads_created_idx       ON leads (created_at DESC);

-- Row Level Security
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads       ENABLE ROW LEVEL SECURITY;

-- Anonymous users can INSERT (public diagnostic tool — no auth required)
CREATE POLICY "anon_insert_diagnostics"
  ON diagnostics FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_leads"
  ON leads FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated roles (service role / Supabase dashboard) can SELECT
CREATE POLICY "auth_read_diagnostics"
  ON diagnostics FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_read_leads"
  ON leads FOR SELECT TO authenticated USING (true);
