
-- Update the soft_delete_user_account function to also hide user's listings
CREATE OR REPLACE FUNCTION public.soft_delete_user_account(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user exists and is not already deleted
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id_param AND account_deleted = false
  ) THEN
    RETURN false;
  END IF;

  -- Hide all listings posted by the user (set status to 'Hidden')
  UPDATE public.sbir_listings 
  SET status = 'Hidden'
  WHERE user_id = user_id_param AND status != 'Hidden';

  -- Soft delete the user account
  UPDATE public.profiles 
  SET 
    account_deleted = true,
    account_deleted_at = NOW()
  WHERE id = user_id_param;

  RETURN true;
END;
$$;
