-- Create a secure function to get profile listings that handles RLS properly
CREATE OR REPLACE FUNCTION public.get_profile_listings(target_user_id uuid)
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
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Check if the requester can view the target user's listings
  -- Either viewing own listings or admin viewing any listings
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
    sl.updated_at
  FROM sbir_listings sl
  WHERE sl.user_id = target_user_id
    AND sl.status IN ('Active', 'Sold')
    AND (
      -- User can view their own listings
      auth.uid() = target_user_id
      OR 
      -- Admin can view any listings
      current_user_is_admin()
    )
    AND current_user_not_deleted()
  ORDER BY sl.submitted_at DESC;
$$;