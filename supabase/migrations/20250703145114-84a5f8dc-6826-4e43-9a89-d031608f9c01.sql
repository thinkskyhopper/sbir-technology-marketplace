
-- Add a column to track marketing email opt-in status
ALTER TABLE public.profiles 
ADD COLUMN marketing_emails_enabled boolean NOT NULL DEFAULT false;

-- Add a comment to explain the column
COMMENT ON COLUMN public.profiles.marketing_emails_enabled IS 'Controls whether the user has opted into marketing emails and blog/newsletter notifications.';
