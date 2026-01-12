-- Migration: Add password authentication support
-- Date: 2026-01-11
-- Description: Add password_hash, auth_provider, and provider_user_id columns to users table

-- Add password_hash column for email/password authentication
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Add auth_provider column to track authentication method
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'email' NOT NULL;

-- Add provider_user_id for social auth providers
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_user_id VARCHAR(255);

-- Create index for faster lookups by provider
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(auth_provider, provider_user_id);

-- Update existing users to use magic_link as their auth provider
UPDATE users SET auth_provider = 'magic_link' WHERE password_hash IS NULL;
