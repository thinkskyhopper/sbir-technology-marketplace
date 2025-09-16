-- Fix RLS policies for sbir_listings to be PERMISSIVE instead of RESTRICTIVE
-- This will allow the .select() call after successful inserts

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can view all listings" ON public.sbir_listings;
DROP POLICY IF EXISTS "Users can view their own listings" ON public.sbir_listings;
DROP POLICY IF EXISTS "Users can view their own listings (full access)" ON public.sbir_listings;
DROP POLICY IF EXISTS "Authenticated users can create listings" ON public.sbir_listings;
DROP POLICY IF EXISTS "Users can update their own pending listings" ON public.sbir_listings;
DROP POLICY IF EXISTS "Admins can update any listing" ON public.sbir_listings;
DROP POLICY IF EXISTS "Admins can delete any listing" ON public.sbir_listings;

-- Create new PERMISSIVE policies for SELECT
CREATE POLICY "Allow admins to view all listings" 
ON public.sbir_listings 
FOR SELECT 
TO authenticated
USING (current_user_is_admin());

CREATE POLICY "Allow users to view their own listings" 
ON public.sbir_listings 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND current_user_not_deleted());

-- Create new PERMISSIVE policies for INSERT
CREATE POLICY "Allow authenticated users to create listings" 
ON public.sbir_listings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL AND current_user_not_deleted());

-- Create new PERMISSIVE policies for UPDATE
CREATE POLICY "Allow admins to update any listing" 
ON public.sbir_listings 
FOR UPDATE 
TO authenticated
USING (current_user_is_admin());

CREATE POLICY "Allow users to update their own pending listings" 
ON public.sbir_listings 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND status = 'Pending'::listing_status AND current_user_not_deleted());

-- Create new PERMISSIVE policies for DELETE
CREATE POLICY "Allow admins to delete any listing" 
ON public.sbir_listings 
FOR DELETE 
TO authenticated
USING (current_user_is_admin());