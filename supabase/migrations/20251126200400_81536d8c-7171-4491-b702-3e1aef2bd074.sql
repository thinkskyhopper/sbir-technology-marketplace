-- Add explicit RLS policy to rate_limit_attempts table
-- This table should only be accessed by edge functions using service role key
CREATE POLICY "Deny all public access to rate_limit_attempts"
ON public.rate_limit_attempts
FOR ALL
USING (false)
WITH CHECK (false);

-- Add comment explaining the security model
COMMENT ON TABLE public.rate_limit_attempts IS 'Security table accessed only by edge functions with service role key. Public access denied via RLS.';