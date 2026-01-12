-- Migration: Add authentication fields to users table
-- Date: 2026-01-11
-- Description: Add password_hash, auth_provider, and provider_user_id columns

-- Add new columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'email' NOT NULL,
ADD COLUMN IF NOT EXISTS provider_user_id VARCHAR(255);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(auth_provider, provider_user_id);

-- Update existing users to use magic_link provider
UPDATE users SET auth_provider = 'magic_link' WHERE password_hash IS NULL;
