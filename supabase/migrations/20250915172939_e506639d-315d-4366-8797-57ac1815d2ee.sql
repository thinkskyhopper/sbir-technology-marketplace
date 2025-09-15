-- 1) Add FK from sbir_listings.user_id to profiles.id (only if it doesn't already exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_sbir_listings_user_id'
  ) THEN
    ALTER TABLE public.sbir_listings
      ADD CONSTRAINT fk_sbir_listings_user_id
      FOREIGN KEY (user_id)
      REFERENCES public.profiles(id)
      ON DELETE RESTRICT;
  END IF;
END $$;

-- 2) Standardize RLS policies on sbir_listings to use current_user_is_admin()
-- Drop existing admin policies that rely on is_admin(auth.uid())
DROP POLICY IF EXISTS "Admins can view all listings" ON public.sbir_listings;
DROP POLICY IF EXISTS "Admins can update any listing" ON public.sbir_listings;
DROP POLICY IF EXISTS "Admins can delete any listing" ON public.sbir_listings;

-- Recreate admin policies using current_user_is_admin()
CREATE POLICY "Admins can view all listings"
ON public.sbir_listings
FOR SELECT
USING (current_user_is_admin());

CREATE POLICY "Admins can update any listing"
ON public.sbir_listings
FOR UPDATE
USING (current_user_is_admin());

CREATE POLICY "Admins can delete any listing"
ON public.sbir_listings
FOR DELETE
USING (current_user_is_admin());

-- Note: Keeping existing non-admin user policies as-is.
-- "Users can view their own listings"
-- "Users can view their own listings (full access)"
-- "Users can update their own pending listings"
-- "Authenticated users can create listings"
