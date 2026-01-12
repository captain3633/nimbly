-- Migration: Add password authentication support
-- Date: 2026-01-11
-- Description: Add password_hash, auth_provider, and provider_user_id columns to users table

-- Add new columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'magic_link' NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_user_id VARCHAR(255);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(auth_provider, provider_user_id);

-- Update existing users to use magic_link provider
UPDATE users SET auth_provider = 'magic_link' WHERE auth_provider IS NULL;
