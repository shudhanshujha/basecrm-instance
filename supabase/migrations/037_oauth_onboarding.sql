-- Migration 037: OAuth / Supabase Auth integration for onboarding
-- Run this in Supabase SQL Editor AFTER migration 036:
-- https://supabase.com/dashboard/project/cyaznzqwpvurdfydzxxv/sql

-- Link Supabase auth.users to our profiles table (for Google/GitHub OAuth)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS supabase_user_id TEXT,
  ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'email';

-- Unique constraint so one Supabase user can only link to one profile
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_supabase_user_id_key;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_supabase_user_id_key UNIQUE (supabase_user_id);

-- Index for fast lookups when OAuth callback fires
CREATE INDEX IF NOT EXISTS idx_profiles_supabase_user_id ON profiles(supabase_user_id);

-- Allow null passwords for OAuth users (they don't set a password themselves)
-- If your password column has a NOT NULL constraint we need to relax it:
ALTER TABLE profiles ALTER COLUMN password DROP NOT NULL;

-- Comment for clarity
COMMENT ON COLUMN profiles.supabase_user_id IS 'References auth.users.id in Supabase — used for OAuth (Google/GitHub) sign-in';
COMMENT ON COLUMN profiles.auth_provider IS 'Either ''email'' (custom password) or ''google'', ''github'', etc.';
