-- Add recommended affiliate columns to sbir_listings table
ALTER TABLE public.sbir_listings 
ADD COLUMN recommended_affiliate_1_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN recommended_affiliate_2_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_sbir_listings_recommended_affiliate_1 ON public.sbir_listings(recommended_affiliate_1_id);
CREATE INDEX idx_sbir_listings_recommended_affiliate_2 ON public.sbir_listings(recommended_affiliate_2_id);

-- Add comment for documentation
COMMENT ON COLUMN public.sbir_listings.recommended_affiliate_1_id IS 'First recommended affiliate expert for this listing';
COMMENT ON COLUMN public.sbir_listings.recommended_affiliate_2_id IS 'Second recommended affiliate expert for this listing';