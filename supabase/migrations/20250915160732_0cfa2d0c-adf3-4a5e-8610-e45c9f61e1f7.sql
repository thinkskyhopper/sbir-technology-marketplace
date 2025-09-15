-- Create secure RPC function for public listing access
-- This function returns only safe, public columns and filters to Active/Sold listings
CREATE OR REPLACE FUNCTION public.get_public_listings()
RETURNS TABLE (
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
  WHERE sl.status IN ('Active', 'Sold')
  ORDER BY sl.created_at DESC;
$$;

-- Grant execute permissions to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_listings() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_listings() TO authenticated;

-- Remove public access to the base sbir_listings table
-- Drop the policies that allow public reading of sensitive data
DROP POLICY IF EXISTS "Anyone can view active and sold listings" ON public.sbir_listings;
DROP POLICY IF EXISTS "Public can view active and sold listings (safe columns only)" ON public.sbir_listings;

-- Revoke direct SELECT access from anon and authenticated roles to harden security
-- Admin and user access to their own listings is preserved through existing policies
REVOKE SELECT ON public.sbir_listings FROM anon;
REVOKE SELECT ON public.sbir_listings FROM authenticated;