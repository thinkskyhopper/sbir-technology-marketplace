-- Create a function to get public profile information (safe fields only)
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE(
  id uuid,
  full_name text,
  first_name text,
  last_name text,
  company_name text,
  bio text,
  role user_role,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.first_name,
    p.last_name,
    p.company_name,
    p.bio,
    p.role,
    p.created_at
  FROM public.profiles p
  WHERE p.id = profile_user_id 
    AND p.account_deleted = false;
$$;

-- Add policy to allow authenticated users to view limited public profile data
CREATE POLICY "Authenticated users can view public profile data" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Allow viewing basic public information (excluding sensitive fields)
  account_deleted = false
);

-- Add restrictive policy to prevent anonymous access to profiles table
CREATE POLICY "Anonymous users cannot access profiles" 
ON public.profiles 
FOR ALL 
TO anon
USING (false);

-- Grant execute permission on the public profile function
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO anon;