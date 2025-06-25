
-- Remove the existing policy that allows users to delete their own listings
DROP POLICY IF EXISTS "Users can delete their own listings" ON public.sbir_listings;

-- Ensure we only have the admin delete policy
-- First check if the admin policy exists and create it if it doesn't
DO $$
BEGIN
    -- Check if the admin policy already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sbir_listings' 
        AND policyname = 'Admins can delete any listing'
    ) THEN
        -- Create the policy for admin deletion only
        EXECUTE 'CREATE POLICY "Admins can delete any listing" ON public.sbir_listings FOR DELETE TO authenticated USING ((SELECT is_admin(auth.uid())))';
    END IF;
END $$;
