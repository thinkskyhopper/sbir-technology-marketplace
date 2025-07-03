
-- Fix the remaining RLS policies that are causing infinite recursion
-- Drop problematic policies first
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

-- Recreate admin policies using security definer functions to avoid recursion
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (current_user_is_admin());

CREATE POLICY "Admins can update any profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (current_user_is_admin());

-- Fix featured_listings policies that reference profiles
DROP POLICY IF EXISTS "Admins can manage featured listings" ON public.featured_listings;

CREATE POLICY "Admins can manage featured listings" 
  ON public.featured_listings 
  FOR ALL 
  USING (current_user_is_admin());

-- Fix team_members policies
DROP POLICY IF EXISTS "Only admins can create team members" ON public.team_members;
DROP POLICY IF EXISTS "Only admins can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Only admins can delete team members" ON public.team_members;

CREATE POLICY "Only admins can create team members" 
  ON public.team_members 
  FOR INSERT 
  WITH CHECK (current_user_is_admin());

CREATE POLICY "Only admins can update team members" 
  ON public.team_members 
  FOR UPDATE 
  USING (current_user_is_admin());

CREATE POLICY "Only admins can delete team members" 
  ON public.team_members 
  FOR DELETE 
  USING (current_user_is_admin());

-- Fix notification_batches policies
DROP POLICY IF EXISTS "Admins can manage notification batches" ON public.notification_batches;

CREATE POLICY "Admins can manage notification batches" 
  ON public.notification_batches 
  FOR ALL 
  USING (current_user_is_admin());

-- Fix notification_job_runs policies  
DROP POLICY IF EXISTS "Admins can manage notification job runs" ON public.notification_job_runs;

CREATE POLICY "Admins can manage notification job runs" 
  ON public.notification_job_runs 
  FOR ALL 
  USING (current_user_is_admin());

-- Fix admin_audit_logs policies
DROP POLICY IF EXISTS "Admins can create audit logs" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.admin_audit_logs;

CREATE POLICY "Admins can create audit logs" 
  ON public.admin_audit_logs 
  FOR INSERT 
  WITH CHECK (current_user_is_admin());

CREATE POLICY "Admins can view all audit logs" 
  ON public.admin_audit_logs 
  FOR SELECT 
  USING (current_user_is_admin());

-- Fix listing_change_requests policies
DROP POLICY IF EXISTS "Admins can update change requests" ON public.listing_change_requests;
DROP POLICY IF EXISTS "Admins can view all change requests" ON public.listing_change_requests;

CREATE POLICY "Admins can update change requests" 
  ON public.listing_change_requests 
  FOR UPDATE 
  USING (current_user_is_admin());

CREATE POLICY "Admins can view all change requests" 
  ON public.listing_change_requests 
  FOR SELECT 
  USING (current_user_is_admin());
