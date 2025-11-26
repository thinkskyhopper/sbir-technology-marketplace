-- Table to track rate-limited actions
CREATE TABLE public.rate_limit_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  identifier TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  
  CONSTRAINT rate_limit_attempts_action_check CHECK (action_type IN ('password_reset', 'sign_up', 'sign_in'))
);

-- Index for fast lookups by action type and identifier
CREATE INDEX idx_rate_limit_attempts_lookup 
ON public.rate_limit_attempts(action_type, identifier, attempted_at DESC);

-- Function to cleanup old records (keep only last 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limit_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.rate_limit_attempts 
  WHERE attempted_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Enable RLS (only service role can access this table)
ALTER TABLE public.rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- No policies needed - only edge functions with service role key can access