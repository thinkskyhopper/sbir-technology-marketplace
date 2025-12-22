-- Add a default value to public_id column so TypeScript allows omitting it
ALTER TABLE public.profiles 
  ALTER COLUMN public_id SET DEFAULT public.generate_public_id();