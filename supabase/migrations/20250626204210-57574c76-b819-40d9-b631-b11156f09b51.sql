
-- Remove the existing foreign key constraint that cascades deletions
ALTER TABLE public.listing_change_requests 
DROP CONSTRAINT IF EXISTS listing_change_requests_listing_id_fkey;

-- Add a new foreign key constraint without CASCADE DELETE
-- This will preserve change request logs even when listings are deleted
ALTER TABLE public.listing_change_requests 
ADD CONSTRAINT listing_change_requests_listing_id_fkey 
FOREIGN KEY (listing_id) REFERENCES public.sbir_listings(id)
ON DELETE SET NULL;

-- Since we're changing to SET NULL, we need to allow listing_id to be nullable
-- to handle cases where the referenced listing has been deleted
ALTER TABLE public.listing_change_requests 
ALTER COLUMN listing_id DROP NOT NULL;

-- Add a new column to store the original listing title and agency 
-- so we can still display meaningful information even after deletion
ALTER TABLE public.listing_change_requests 
ADD COLUMN listing_title TEXT,
ADD COLUMN listing_agency TEXT;

-- Update existing records with listing information
UPDATE public.listing_change_requests 
SET 
  listing_title = sbir_listings.title,
  listing_agency = sbir_listings.agency
FROM public.sbir_listings 
WHERE listing_change_requests.listing_id = sbir_listings.id;
