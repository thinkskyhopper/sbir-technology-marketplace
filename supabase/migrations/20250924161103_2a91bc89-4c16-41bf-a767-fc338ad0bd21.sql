-- Add internal title and description fields to sbir_listings table
ALTER TABLE public.sbir_listings 
ADD COLUMN internal_title text NULL,
ADD COLUMN internal_description text NULL;