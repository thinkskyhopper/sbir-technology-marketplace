
-- First, let's create security definer functions to avoid infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.current_user_not_deleted()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT account_deleted = false FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' AND account_deleted = false FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Now let's fix the profiles table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Recreate profiles policies without circular references
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
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin' AND p.account_deleted = false
    )
  );

CREATE POLICY "Admins can update any profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin' AND p.account_deleted = false
    )
  );

-- Fix other policies to use the security definer functions
DROP POLICY IF EXISTS "Users can view their own listings" ON public.sbir_listings;
DROP POLICY IF EXISTS "Users can update their own pending listings" ON public.sbir_listings;
DROP POLICY IF EXISTS "Authenticated users can create listings" ON public.sbir_listings;

CREATE POLICY "Users can view their own listings" 
  ON public.sbir_listings 
  FOR SELECT 
  USING (auth.uid() = user_id AND current_user_not_deleted());

CREATE POLICY "Users can update their own pending listings" 
  ON public.sbir_listings 
  FOR UPDATE 
  USING (
    auth.uid() = user_id AND 
    status = 'Pending'::listing_status AND
    current_user_not_deleted()
  );

CREATE POLICY "Authenticated users can create listings" 
  ON public.sbir_listings 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    auth.uid() IS NOT NULL AND
    current_user_not_deleted()
  );

-- Fix listing_change_requests policies
DROP POLICY IF EXISTS "Users can view their own change requests" ON public.listing_change_requests;
DROP POLICY IF EXISTS "Users can create change requests for their listings" ON public.listing_change_requests;

CREATE POLICY "Users can view their own change requests" 
  ON public.listing_change_requests 
  FOR SELECT 
  USING (auth.uid() = user_id AND current_user_not_deleted());

CREATE POLICY "Users can create change requests for their listings" 
  ON public.listing_change_requests 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.sbir_listings 
      WHERE id = listing_change_requests.listing_id AND user_id = auth.uid()
    ) AND
    current_user_not_deleted()
  );

-- Fix user_bookmarks policies
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users can create their own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.user_bookmarks;

CREATE POLICY "Users can view their own bookmarks" 
  ON public.user_bookmarks 
  FOR SELECT 
  USING (auth.uid() = user_id AND current_user_not_deleted());

CREATE POLICY "Users can create their own bookmarks" 
  ON public.user_bookmarks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND current_user_not_deleted());

CREATE POLICY "Users can delete their own bookmarks" 
  ON public.user_bookmarks 
  FOR DELETE 
  USING (auth.uid() = user_id AND current_user_not_deleted());

-- Fix notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id AND current_user_not_deleted());

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id AND current_user_not_deleted());
