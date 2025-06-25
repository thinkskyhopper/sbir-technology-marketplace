
-- First, let's check the current RLS policies on the sbir_listings table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'sbir_listings';

-- If there are no DELETE policies for admins, let's create one
-- This policy allows admins to delete any listing
DO $$
BEGIN
    -- Check if the policy already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sbir_listings' 
        AND policyname = 'Admins can delete any listing'
    ) THEN
        -- Create the policy for admin deletion
        EXECUTE 'CREATE POLICY "Admins can delete any listing" ON public.sbir_listings FOR DELETE TO authenticated USING ((SELECT is_admin(auth.uid())))';
    END IF;
END $$;

-- Also ensure users can delete their own listings
DO $$
BEGIN
    -- Check if the policy already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sbir_listings' 
        AND policyname = 'Users can delete their own listings'
    ) THEN
        -- Create the policy for user deletion of their own listings
        EXECUTE 'CREATE POLICY "Users can delete their own listings" ON public.sbir_listings FOR DELETE TO authenticated USING (auth.uid() = user_id)';
    END IF;
END $$;

-- Make sure RLS is enabled on the table
ALTER TABLE public.sbir_listings ENABLE ROW LEVEL SECURITY;
