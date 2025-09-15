-- Create secure RPC function for public featured listings access
-- This function returns only safe columns and joins with sbir_listings data
CREATE OR REPLACE FUNCTION public.get_public_featured_listings()
RETURNS TABLE (
  id uuid,
  listing_id uuid,
  display_order integer,
  -- Join with sbir_listings to get the actual listing data
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
  listing_created_at timestamp with time zone,
  listing_updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    fl.id,
    fl.listing_id,
    fl.display_order,
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
    sl.created_at as listing_created_at,
    sl.updated_at as listing_updated_at
  FROM featured_listings fl
  INNER JOIN sbir_listings sl ON fl.listing_id = sl.id
  WHERE sl.status = 'Active'
  ORDER BY fl.display_order ASC;
$$;

-- Grant execute permissions to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_featured_listings() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_featured_listings() TO authenticated;

-- Remove public access to the base featured_listings table
-- Drop the policy that allows everyone to view featured listings
DROP POLICY IF EXISTS "Everyone can view featured listings" ON public.featured_listings;

-- Revoke direct SELECT access from anon and authenticated roles
-- Admin access is preserved through existing admin policies
REVOKE SELECT ON public.featured_listings FROM anon;
REVOKE SELECT ON public.featured_listings FROM authenticated;