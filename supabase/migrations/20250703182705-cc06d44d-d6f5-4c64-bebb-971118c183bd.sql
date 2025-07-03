
-- Update the RLS policy to allow everyone to view both Active and Sold listings
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.sbir_listings;

CREATE POLICY "Anyone can view active and sold listings" 
  ON public.sbir_listings 
  FOR SELECT 
  USING (status IN ('Active', 'Sold'));
