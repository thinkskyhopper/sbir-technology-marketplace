-- Add lockout fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN account_locked boolean DEFAULT false NOT NULL,
ADD COLUMN account_locked_at timestamp with time zone,
ADD COLUMN account_locked_until timestamp with time zone,
ADD COLUMN lock_reason text;

-- Create function to unlock user accounts (self-service and auto-unlock)
CREATE OR REPLACE FUNCTION public.unlock_user_account(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_email text;
BEGIN
  -- Get user email
  SELECT email INTO user_email FROM public.profiles WHERE id = user_id_param;
  
  IF user_email IS NULL THEN
    RETURN false;
  END IF;

  -- Clear lockout status
  UPDATE public.profiles 
  SET 
    account_locked = false,
    account_locked_at = NULL,
    account_locked_until = NULL,
    lock_reason = NULL
  WHERE id = user_id_param;

  -- Clear rate limit attempts
  DELETE FROM public.rate_limit_attempts 
  WHERE identifier = LOWER(user_email);

  RETURN true;
END;
$$;

-- Create function for admin unlock with audit trail
CREATE OR REPLACE FUNCTION public.admin_unlock_user_account(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only admins can unlock accounts
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only administrators can unlock user accounts';
  END IF;

  -- Unlock the account
  RETURN public.unlock_user_account(target_user_id);
END;
$$;