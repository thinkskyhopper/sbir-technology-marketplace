-- Backfill missing profiles for existing users
-- This ensures RLS functions like current_user_not_deleted() work for all authenticated users

INSERT INTO public.profiles (id, email, full_name, first_name, last_name, display_email, marketing_emails_enabled)
SELECT 
  u.id,
  u.email,
  (u.raw_user_meta_data ->> 'full_name')::text AS full_name,
  split_part((u.raw_user_meta_data ->> 'full_name')::text, ' ', 1) AS first_name,
  CASE
    WHEN array_length(string_to_array((u.raw_user_meta_data ->> 'full_name')::text, ' '), 1) > 1
      THEN substring((u.raw_user_meta_data ->> 'full_name')::text from length(split_part((u.raw_user_meta_data ->> 'full_name')::text, ' ', 1)) + 2)
    ELSE NULL
  END AS last_name,
  u.email AS display_email,
  COALESCE((u.raw_user_meta_data ->> 'marketing_emails_enabled')::boolean, false) AS marketing_emails_enabled
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;