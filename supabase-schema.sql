-- ============================================================
--  Fidelity Bank — Supabase Schema Migration
--  Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
--  PROFILES
--  Mirrors Firebase Auth users. The id matches the Supabase
--  Auth user id (UUID) created on sign-up.
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  name TEXT DEFAULT '',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  ACCOUNTS
--  Bank accounts tied to a user via userId (Supabase Auth UUID).
-- ============================================================
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Checking',
  balance DECIMAL(15,2) DEFAULT 0,
  "userId" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  TRANSACTIONS
--  Financial transactions linked to an account.
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "accountId" TEXT NOT NULL,
  type TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT DEFAULT '',
  date TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_accounts_userId ON accounts("userId");
CREATE INDEX IF NOT EXISTS idx_transactions_accountId ON transactions("accountId");

-- ============================================================
--  ROW LEVEL SECURITY
--  Enable RLS and create permissive policies so the anon key
--  can read/write all tables. For production, restrict these.
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (demo / admin-panel usage)
CREATE POLICY "Allow all on profiles" ON profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all on accounts" ON accounts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all on transactions" ON transactions
  FOR ALL USING (true) WITH CHECK (true);
