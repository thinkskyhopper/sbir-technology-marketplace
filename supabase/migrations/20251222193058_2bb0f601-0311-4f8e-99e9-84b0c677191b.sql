-- Drop and recreate get_public_featured_listings to include public_id
DROP FUNCTION IF EXISTS public.get_public_featured_listings();

CREATE OR REPLACE FUNCTION public.get_public_featured_listings()
RETURNS TABLE(
  id uuid,
  listing_id uuid,
  display_order integer,
  public_id text,
  title text,
  description text,
  phase sbir_phase,
  agency text,
  value bigint,
  deadline date,
  category text,
  listing_type listing_type,
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
SET search_path TO 'public'
AS $$
  SELECT 
    fl.id,
    fl.listing_id,
    fl.display_order,
    sl.public_id,
    sl.title,
    sl.description,
    sl.phase,
    sl.agency,
    sl.value,
    sl.deadline,
    sl.category,
    sl.listing_type,
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

-- Drop and recreate get_public_listings to include public_id
DROP FUNCTION IF EXISTS public.get_public_listings();

CREATE OR REPLACE FUNCTION public.get_public_listings()
RETURNS TABLE(
  id uuid,
  public_id text,
  title text,
  description text,
  phase sbir_phase,
  agency text,
  value bigint,
  deadline date,
  category text,
  listing_type listing_type,
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
SET search_path TO 'public'
AS $$
  SELECT 
    sl.id,
    sl.public_id,
    sl.title,
    sl.description,
    sl.phase,
    sl.agency,
    sl.value,
    sl.deadline,
    sl.category,
    sl.listing_type,
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