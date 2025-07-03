
-- Fix security issues by setting immutable search_path for all functions

-- Fix set_date_sold function
CREATE OR REPLACE FUNCTION public.set_date_sold()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
    -- If status is being changed to 'Sold' and it wasn't 'Sold' before
    IF NEW.status = 'Sold' AND (OLD.status IS NULL OR OLD.status != 'Sold') THEN
        NEW.date_sold = NOW();
    -- If status is being changed away from 'Sold', clear the date_sold
    ELSIF NEW.status != 'Sold' AND OLD.status = 'Sold' THEN
        NEW.date_sold = NULL;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Fix restore_user_account function
CREATE OR REPLACE FUNCTION public.restore_user_account(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if user exists and is deleted
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id_param AND account_deleted = true
  ) THEN
    RETURN false;
  END IF;

  -- Restore the user account
  UPDATE public.profiles 
  SET 
    account_deleted = false,
    account_deleted_at = NULL
  WHERE id = user_id_param;

  RETURN true;
END;
$$;

-- Fix current_user_not_deleted function
CREATE OR REPLACE FUNCTION public.current_user_not_deleted()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT COALESCE(
    (SELECT account_deleted = false FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Fix current_user_is_admin function
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' AND account_deleted = false FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Fix soft_delete_user_account function
CREATE OR REPLACE FUNCTION public.soft_delete_user_account(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Fix get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;
