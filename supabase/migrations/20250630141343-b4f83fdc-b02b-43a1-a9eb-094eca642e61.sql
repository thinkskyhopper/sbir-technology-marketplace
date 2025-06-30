
-- Add new columns to the profiles table for bio, display_email, and notification preferences
ALTER TABLE public.profiles 
ADD COLUMN bio TEXT,
ADD COLUMN display_email TEXT,
ADD COLUMN notification_categories JSONB DEFAULT '[]'::jsonb;

-- Update the handle_new_user function to include display_email initialization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, display_email)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email  -- Initialize display_email with the signup email
  );
  RETURN NEW;
END;
$$;
