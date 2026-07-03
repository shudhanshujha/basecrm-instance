-- Migration 036: Add onboarding tracking fields
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cyaznzqwpvurdfydzxxv/sql

-- Add onboarding fields to organizations table
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_step INTEGER NOT NULL DEFAULT 0;

-- Add onboarding field to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Mark existing orgs/profiles as already onboarded (they were created before this migration)
UPDATE organizations SET onboarding_completed = TRUE WHERE created_at < NOW();
UPDATE profiles SET onboarding_completed = TRUE WHERE created_at < NOW();
