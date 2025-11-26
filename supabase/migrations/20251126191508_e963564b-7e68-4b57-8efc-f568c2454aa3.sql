-- Add 'sign_in_failed' to the rate_limit_attempts action_type tracking
-- This allows us to track failed sign-in attempts for rate limiting

-- Note: We're not adding a CHECK constraint since the existing pattern
-- uses soft validation and this allows for future action types without migrations

-- Add a comment to document the expected action types
COMMENT ON COLUMN public.rate_limit_attempts.action_type IS 'Type of action being rate limited. Common values: password_reset, sign_in_failed';
