-- Rename 'consultant' to 'affiliate' in user_role enum
ALTER TYPE user_role RENAME VALUE 'consultant' TO 'affiliate';

-- Rename 'consultant' to 'affiliate' in app_role enum  
ALTER TYPE app_role RENAME VALUE 'consultant' TO 'affiliate';

-- Update the sync_role_to_profiles function to use 'affiliate'
CREATE OR REPLACE FUNCTION public.sync_role_to_profiles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.profiles
  SET role = (
    SELECT ur.role::text::user_role
    FROM public.user_roles ur
    WHERE ur.user_id = COALESCE(NEW.user_id, OLD.user_id)
    ORDER BY 
      CASE ur.role
        WHEN 'admin'::app_role THEN 1
        WHEN 'affiliate'::app_role THEN 2
        WHEN 'verified'::app_role THEN 3
        WHEN 'user'::app_role THEN 4
      END
    LIMIT 1
  )
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Update the get_user_role function to use 'affiliate'
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role::text 
  FROM public.user_roles 
  WHERE user_roles.user_id = get_user_role.user_id
  ORDER BY 
    CASE role
      WHEN 'admin'::app_role THEN 1
      WHEN 'affiliate'::app_role THEN 2
      WHEN 'verified'::app_role THEN 3
      WHEN 'user'::app_role THEN 4
    END
  LIMIT 1;
$function$;