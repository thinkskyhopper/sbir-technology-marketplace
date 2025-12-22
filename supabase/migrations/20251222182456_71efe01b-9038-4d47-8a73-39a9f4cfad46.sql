-- Add public_id column to profiles table
ALTER TABLE public.profiles ADD COLUMN public_id text UNIQUE;

-- Create function to generate 12-character nanoid-style IDs
CREATE OR REPLACE FUNCTION public.generate_public_id()
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * 62 + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Generate IDs for all existing users
UPDATE public.profiles SET public_id = public.generate_public_id() WHERE public_id IS NULL;

-- Make column NOT NULL after populating
ALTER TABLE public.profiles ALTER COLUMN public_id SET NOT NULL;

-- Create trigger function to set public_id on new profiles
CREATE OR REPLACE FUNCTION public.set_profile_public_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.public_id IS NULL THEN
    NEW.public_id := public.generate_public_id();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for new profiles
DROP TRIGGER IF EXISTS profiles_set_public_id ON public.profiles;
CREATE TRIGGER profiles_set_public_id
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_profile_public_id();

-- Update get_public_profile to support lookup by either UUID or public_id
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE OR REPLACE FUNCTION public.get_public_profile_by_identifier(identifier text)
RETURNS TABLE(id uuid, public_id text, full_name text, first_name text, last_name text, company_name text, bio text, role user_role, photo_url text, created_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    p.id,
    p.public_id,
    p.full_name,
    p.first_name,
    p.last_name,
    p.company_name,
    p.bio,
    p.role,
    p.photo_url,
    p.created_at
  FROM public.profiles p
  WHERE (p.id::text = identifier OR p.public_id = identifier)
    AND p.account_deleted = false;
$$;

-- Keep the old function for backward compatibility but have it call the new one
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE(id uuid, public_id text, full_name text, first_name text, last_name text, company_name text, bio text, role user_role, photo_url text, created_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT * FROM public.get_public_profile_by_identifier(profile_user_id::text);
$$;