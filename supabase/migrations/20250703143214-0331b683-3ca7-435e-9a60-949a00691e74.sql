
-- Add first_name and last_name columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;

-- Update existing profiles to split full_name into first_name and last_name
UPDATE public.profiles 
SET 
  first_name = SPLIT_PART(full_name, ' ', 1),
  last_name = CASE 
    WHEN ARRAY_LENGTH(STRING_TO_ARRAY(full_name, ' '), 1) > 1 
    THEN SUBSTRING(full_name FROM LENGTH(SPLIT_PART(full_name, ' ', 1)) + 2)
    ELSE ''
  END
WHERE full_name IS NOT NULL;

-- Update the handle_new_user function to store first and last names separately and marketing opt-in
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  full_name_value TEXT;
  first_name_value TEXT;
  last_name_value TEXT;
  marketing_opt_in BOOLEAN;
BEGIN
  -- Get the full name from metadata
  full_name_value := NEW.raw_user_meta_data ->> 'full_name';
  marketing_opt_in := COALESCE((NEW.raw_user_meta_data ->> 'marketing_emails_enabled')::boolean, false);
  
  -- Split into first and last name
  IF full_name_value IS NOT NULL THEN
    first_name_value := SPLIT_PART(full_name_value, ' ', 1);
    last_name_value := CASE 
      WHEN ARRAY_LENGTH(STRING_TO_ARRAY(full_name_value, ' '), 1) > 1 
      THEN SUBSTRING(full_name_value FROM LENGTH(SPLIT_PART(full_name_value, ' ', 1)) + 2)
      ELSE ''
    END;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, first_name, last_name, display_email, marketing_emails_enabled)
  VALUES (
    NEW.id, 
    NEW.email,
    full_name_value,
    first_name_value,
    last_name_value,
    NEW.email,
    marketing_opt_in
  );
  RETURN NEW;
END;
$function$;
