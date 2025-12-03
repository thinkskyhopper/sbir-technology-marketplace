-- Update get_public_profile function to include photo_url
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
 RETURNS TABLE(id uuid, full_name text, first_name text, last_name text, company_name text, bio text, role user_role, photo_url text, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    p.id,
    p.full_name,
    p.first_name,
    p.last_name,
    p.company_name,
    p.bio,
    p.role,
    p.photo_url,
    p.created_at
  FROM public.profiles p
  WHERE p.id = profile_user_id 
    AND p.account_deleted = false;
$function$;