-- Pulso — Initial Schema
-- Run this in your Supabase SQL editor or via supabase db push

-- Stores every NIT lookup with its computed compliance score
CREATE TABLE IF NOT EXISTS diagnoses (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nit         TEXT        NOT NULL,
  company_data JSONB      NOT NULL,
  score       INTEGER     NOT NULL CHECK (score BETWEEN 0 AND 100),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Stores email leads captured at the dashboard gate
CREATE TABLE IF NOT EXISTS leads (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        NOT NULL,
  nit        TEXT        NOT NULL,
  score      INTEGER     NOT NULL CHECK (score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS diagnoses_nit_idx      ON diagnoses (nit);
CREATE INDEX IF NOT EXISTS diagnoses_created_idx  ON diagnoses (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx        ON leads (email);
CREATE INDEX IF NOT EXISTS leads_nit_idx          ON leads (nit);

-- Row Level Security
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads     ENABLE ROW LEVEL SECURITY;

-- Anonymous users can INSERT (public diagnosis / lead capture)
CREATE POLICY "anon_insert_diagnoses"
  ON diagnoses FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_leads"
  ON leads FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated (service role / dashboard) can SELECT
CREATE POLICY "auth_read_diagnoses"
  ON diagnoses FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_read_leads"
  ON leads FOR SELECT TO authenticated USING (true);
