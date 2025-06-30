
-- Add a column to control whether users can submit listings
ALTER TABLE public.profiles 
ADD COLUMN can_submit_listings boolean NOT NULL DEFAULT true;

-- Add a comment to explain the column
COMMENT ON COLUMN public.profiles.can_submit_listings IS 'Controls whether the user can submit new listings. Admins can disable this to prevent spam or inappropriate submissions.';
