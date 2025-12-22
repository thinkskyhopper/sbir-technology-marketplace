-- Add default value to public_id column so inserts work without providing it
ALTER TABLE public.sbir_listings 
ALTER COLUMN public_id SET DEFAULT public.generate_public_id();