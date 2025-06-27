
-- Add admin_notes_for_user column to store notes that should be shared with the user
ALTER TABLE public.listing_change_requests 
ADD COLUMN admin_notes_for_user TEXT;

-- Update the existing admin_notes column comment to clarify it's for internal use
COMMENT ON COLUMN public.listing_change_requests.admin_notes IS 'Internal admin notes, not shared with user';
COMMENT ON COLUMN public.listing_change_requests.admin_notes_for_user IS 'Admin notes that will be shared with the user in email notifications';
