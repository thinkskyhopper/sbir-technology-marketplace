-- Create optimized RPC function that joins listings with profiles in a single query
CREATE OR REPLACE FUNCTION public.get_public_listings_with_profiles()
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  phase sbir_phase,
  agency text,
  value bigint,
  deadline date,
  category text,
  status listing_status,
  submitted_at timestamp with time zone,
  approved_at timestamp with time zone,
  user_id uuid,
  photo_url text,
  date_sold timestamp with time zone,
  technology_summary text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  profile_full_name text,
  profile_first_name text,
  profile_last_name text,
  profile_company_name text,
  profile_bio text,
  profile_role user_role
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    sl.id,
    sl.title,
    sl.description,
    sl.phase,
    sl.agency,
    sl.value,
    sl.deadline,
    sl.category,
    sl.status,
    sl.submitted_at,
    sl.approved_at,
    sl.user_id,
    sl.photo_url,
    sl.date_sold,
    sl.technology_summary,
    sl.created_at,
    sl.updated_at,
    p.full_name as profile_full_name,
    p.first_name as profile_first_name,
    p.last_name as profile_last_name,
    p.company_name as profile_company_name,
    p.bio as profile_bio,
    p.role as profile_role
  FROM sbir_listings sl
  LEFT JOIN profiles p ON sl.user_id = p.id
  WHERE sl.status IN ('Active', 'Sold')
    AND p.account_deleted = false
  ORDER BY sl.created_at DESC;
$$;