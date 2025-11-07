-- Phase 3: Add RLS policy enforcement for account deletion
-- The current_user_not_deleted() function already exists, so we just need to update policies

-- Update sbir_listings policies
DROP POLICY IF EXISTS "Allow authenticated users to create listings" ON sbir_listings;
CREATE POLICY "Allow authenticated users to create listings"
ON sbir_listings
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = user_id) AND (auth.uid() IS NOT NULL) AND current_user_not_deleted());

DROP POLICY IF EXISTS "Allow users to update their own pending listings" ON sbir_listings;
CREATE POLICY "Allow users to update their own pending listings"
ON sbir_listings
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id) AND (status = 'Pending'::listing_status) AND current_user_not_deleted())
WITH CHECK ((auth.uid() = user_id) AND (status = 'Pending'::listing_status) AND current_user_not_deleted());

DROP POLICY IF EXISTS "Allow users to view their own listings" ON sbir_listings;
CREATE POLICY "Allow users to view their own listings"
ON sbir_listings
FOR SELECT
TO authenticated
USING ((auth.uid() = user_id) AND current_user_not_deleted());

-- Update listing_change_requests policies
DROP POLICY IF EXISTS "Users can create change requests for their listings" ON listing_change_requests;
CREATE POLICY "Users can create change requests for their listings"
ON listing_change_requests
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = user_id) 
  AND (EXISTS (
    SELECT 1 FROM sbir_listings 
    WHERE sbir_listings.id = listing_change_requests.listing_id 
    AND sbir_listings.user_id = auth.uid()
  )) 
  AND current_user_not_deleted()
);

DROP POLICY IF EXISTS "Users can view their own change requests" ON listing_change_requests;
CREATE POLICY "Users can view their own change requests"
ON listing_change_requests
FOR SELECT
TO authenticated
USING ((auth.uid() = user_id) AND current_user_not_deleted());

-- Update contact_inquiries policies
DROP POLICY IF EXISTS "Authenticated users can create inquiries" ON contact_inquiries;
CREATE POLICY "Authenticated users can create inquiries"
ON contact_inquiries
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = inquirer_id) AND (auth.uid() IS NOT NULL) AND current_user_not_deleted());

DROP POLICY IF EXISTS "Users can view their own inquiries" ON contact_inquiries;
CREATE POLICY "Users can view their own inquiries"
ON contact_inquiries
FOR SELECT
TO authenticated
USING ((auth.uid() = inquirer_id) AND current_user_not_deleted());

DROP POLICY IF EXISTS "Listing owners can view inquiries for their listings" ON contact_inquiries;
CREATE POLICY "Listing owners can view inquiries for their listings"
ON contact_inquiries
FOR SELECT
TO authenticated
USING (
  (EXISTS (
    SELECT 1 FROM sbir_listings 
    WHERE sbir_listings.id = contact_inquiries.listing_id 
    AND sbir_listings.user_id = auth.uid()
  )) 
  AND current_user_not_deleted()
);

-- Update admin policies to also check account deletion
DROP POLICY IF EXISTS "Allow admins to view all listings" ON sbir_listings;
CREATE POLICY "Allow admins to view all listings"
ON sbir_listings
FOR SELECT
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Allow admins to update any listing" ON sbir_listings;
CREATE POLICY "Allow admins to update any listing"
ON sbir_listings
FOR UPDATE
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted())
WITH CHECK (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Allow admins to delete any listing" ON sbir_listings;
CREATE POLICY "Allow admins to delete any listing"
ON sbir_listings
FOR DELETE
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Admins can view all change requests" ON listing_change_requests;
CREATE POLICY "Admins can view all change requests"
ON listing_change_requests
FOR SELECT
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Admins can update change requests" ON listing_change_requests;
CREATE POLICY "Admins can update change requests"
ON listing_change_requests
FOR UPDATE
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted())
WITH CHECK (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile"
ON profiles
FOR UPDATE
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted())
WITH CHECK (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Admins can view all inquiries" ON contact_inquiries;
CREATE POLICY "Admins can view all inquiries"
ON contact_inquiries
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()) AND current_user_not_deleted());

-- Update other admin-only policies
DROP POLICY IF EXISTS "Admins can manage notification job runs" ON notification_job_runs;
CREATE POLICY "Admins can manage notification job runs"
ON notification_job_runs
FOR ALL
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted())
WITH CHECK (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Admins can manage notification batches" ON notification_batches;
CREATE POLICY "Admins can manage notification batches"
ON notification_batches
FOR ALL
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted())
WITH CHECK (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Only admins can create team members" ON team_members;
CREATE POLICY "Only admins can create team members"
ON team_members
FOR INSERT
TO authenticated
WITH CHECK (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Only admins can update team members" ON team_members;
CREATE POLICY "Only admins can update team members"
ON team_members
FOR UPDATE
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted())
WITH CHECK (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Only admins can delete team members" ON team_members;
CREATE POLICY "Only admins can delete team members"
ON team_members
FOR DELETE
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Admins can manage featured listings" ON featured_listings;
CREATE POLICY "Admins can manage featured listings"
ON featured_listings
FOR ALL
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted())
WITH CHECK (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Admins can create audit logs" ON admin_audit_logs;
CREATE POLICY "Admins can create audit logs"
ON admin_audit_logs
FOR INSERT
TO authenticated
WITH CHECK (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Admins can view all audit logs" ON admin_audit_logs;
CREATE POLICY "Admins can view all audit logs"
ON admin_audit_logs
FOR SELECT
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Admins can read all admin settings" ON admin_settings;
CREATE POLICY "Admins can read all admin settings"
ON admin_settings
FOR SELECT
TO authenticated
USING (current_user_is_admin() AND current_user_not_deleted());

DROP POLICY IF EXISTS "Admins can manage admin settings" ON admin_settings;
CREATE POLICY "Admins can manage admin settings"
ON admin_settings
FOR ALL
TO authenticated
USING (
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )) 
  AND current_user_not_deleted()
)
WITH CHECK (
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )) 
  AND current_user_not_deleted()
);