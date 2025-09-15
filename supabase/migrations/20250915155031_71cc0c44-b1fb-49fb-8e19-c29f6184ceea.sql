-- Add public access column to categorize settings
ALTER TABLE public.admin_settings 
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false;

-- Mark the phase_iii_badge_corner setting as public since it's needed for UI
UPDATE public.admin_settings 
SET is_public = true 
WHERE setting_key = 'phase_iii_badge_corner';

-- Drop the overly permissive public read policy
DROP POLICY IF EXISTS "Users can read admin settings" ON public.admin_settings;

-- Create new restrictive policies
CREATE POLICY "Public can read public admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Admins can read all admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (current_user_is_admin());

-- Keep existing admin management policy
-- "Admins can manage admin settings" already exists and covers INSERT, UPDATE, DELETE