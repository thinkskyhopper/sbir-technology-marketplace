
-- Add foreign key constraint between sbir_listings.user_id and profiles.id
ALTER TABLE public.sbir_listings 
ADD CONSTRAINT fk_sbir_listings_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
