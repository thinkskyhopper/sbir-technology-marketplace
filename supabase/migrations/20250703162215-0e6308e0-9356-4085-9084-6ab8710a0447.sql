
-- Add soft deletion columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN account_deleted BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN account_deleted_at TIMESTAMP WITH TIME ZONE NULL;

-- Update RLS policies to exclude soft-deleted accounts
-- First, drop existing policies that need to be updated
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Recreate policies with soft deletion checks
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id AND account_deleted = false);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id AND account_deleted = false);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin' AND account_deleted = false
    )
  );

CREATE POLICY "Admins can update any profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin' AND account_deleted = false
    )
  );

-- Update other table policies to exclude soft-deleted users
-- Update sbir_listings policies
DROP POLICY IF EXISTS "Users can view their own listings" ON public.sbir_listings;
DROP POLICY IF EXISTS "Users can update their own pending listings" ON public.sbir_listings;
DROP POLICY IF EXISTS "Authenticated users can create listings" ON public.sbir_listings;

CREATE POLICY "Users can view their own listings" 
  ON public.sbir_listings 
  FOR SELECT 
  USING (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND account_deleted = false
    )
  );

CREATE POLICY "Users can update their own pending listings" 
  ON public.sbir_listings 
  FOR UPDATE 
  USING (
    auth.uid() = user_id AND 
    status = 'Pending'::listing_status AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND account_deleted = false
    )
  );

CREATE POLICY "Authenticated users can create listings" 
  ON public.sbir_listings 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND account_deleted = false
    )
  );

-- Update listing_change_requests policies
DROP POLICY IF EXISTS "Users can view their own change requests" ON public.listing_change_requests;
DROP POLICY IF EXISTS "Users can create change requests for their listings" ON public.listing_change_requests;

CREATE POLICY "Users can view their own change requests" 
  ON public.listing_change_requests 
  FOR SELECT 
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND account_deleted = false
    )
  );

CREATE POLICY "Users can create change requests for their listings" 
  ON public.listing_change_requests 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.sbir_listings 
      WHERE id = listing_change_requests.listing_id AND user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND account_deleted = false
    )
  );

-- Update other user-related policies
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users can create their own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.user_bookmarks;

CREATE POLICY "Users can view their own bookmarks" 
  ON public.user_bookmarks 
  FOR SELECT 
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND account_deleted = false
    )
  );

CREATE POLICY "Users can create their own bookmarks" 
  ON public.user_bookmarks 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND account_deleted = false
    )
  );

CREATE POLICY "Users can delete their own bookmarks" 
  ON public.user_bookmarks 
  FOR DELETE 
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND account_deleted = false
    )
  );

-- Update notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND account_deleted = false
    )
  );

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND account_deleted = false
    )
  );

-- Create function to soft delete user account
CREATE OR REPLACE FUNCTION public.soft_delete_user_account(user_id_param UUID)
RETURNS BOOLEAN
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

  -- Soft delete the user account
  UPDATE public.profiles 
  SET 
    account_deleted = true,
    account_deleted_at = NOW()
  WHERE id = user_id_param;

  RETURN true;
END;
$$;

-- Create function to restore user account (for admin use)
CREATE OR REPLACE FUNCTION public.restore_user_account(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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
