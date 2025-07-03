
-- Add separate columns for different types of email notifications
ALTER TABLE public.profiles 
ADD COLUMN listing_email_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN category_email_notifications_enabled BOOLEAN NOT NULL DEFAULT true;

-- Add comments to explain the columns
COMMENT ON COLUMN public.profiles.listing_email_notifications_enabled IS 'Controls whether the user receives email notifications about their listing submissions and change requests';
COMMENT ON COLUMN public.profiles.category_email_notifications_enabled IS 'Controls whether the user receives email notifications about new listings in their selected categories';
COMMENT ON COLUMN public.profiles.email_notifications_enabled IS 'Master toggle for all email notifications - when false, no emails are sent regardless of other settings';
