
-- Add foreign key constraint between listing_change_requests and profiles
ALTER TABLE public.listing_change_requests 
ADD CONSTRAINT listing_change_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;
