
-- Add email notification preference column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email_notifications_enabled BOOLEAN NOT NULL DEFAULT true;

-- Add comment to explain the column
COMMENT ON COLUMN public.profiles.email_notifications_enabled IS 'Controls whether the user receives email notifications. When false, user only receives on-site notifications.';
