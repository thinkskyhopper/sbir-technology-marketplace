-- Remove the dangerous RLS policy that allows any authenticated user to view all profile data
DROP POLICY IF EXISTS "Authenticated users can view public profile data" ON public.profiles;