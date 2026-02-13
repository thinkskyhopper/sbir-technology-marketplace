-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins can manage featured listings" ON featured_listings;

-- Recreate as a permissive policy (default behavior)
CREATE POLICY "Admins can manage featured listings"
  ON featured_listings
  FOR ALL
  TO authenticated
  USING (current_user_is_admin() AND current_user_not_deleted())
  WITH CHECK (current_user_is_admin() AND current_user_not_deleted());