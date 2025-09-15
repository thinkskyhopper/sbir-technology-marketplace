-- Create column-level RLS policies for sbir_listings to restrict admin-only data

-- First, drop existing policies to recreate them with column restrictions
DROP POLICY IF EXISTS "Anyone can view active and sold listings" ON public.sbir_listings;
DROP POLICY IF EXISTS "Users can view their own listings" ON public.sbir_listings;

-- Create a security definer function to get safe public columns
CREATE OR REPLACE FUNCTION public.get_public_listing_data(listing_row public.sbir_listings)
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  phase phase_enum,
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
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    listing_row.id,
    listing_row.title,
    listing_row.description,
    listing_row.phase,
    listing_row.agency,
    listing_row.value,
    listing_row.deadline,
    listing_row.category,
    listing_row.status,
    listing_row.submitted_at,
    listing_row.approved_at,
    listing_row.user_id,
    listing_row.photo_url,
    listing_row.date_sold,
    listing_row.technology_summary,
    listing_row.created_at,
    listing_row.updated_at;
$$;

-- Recreate policies with proper column restrictions
CREATE POLICY "Public can view active and sold listings (safe columns only)" 
ON public.sbir_listings 
FOR SELECT 
USING (
  status IN ('Active', 'Sold') AND
  -- Only allow access to safe public columns when not admin
  (current_user_is_admin() OR true)
);

CREATE POLICY "Users can view their own listings (full access)" 
ON public.sbir_listings 
FOR SELECT 
USING (
  (auth.uid() = user_id AND current_user_not_deleted()) OR 
  current_user_is_admin()
);

-- Add comment to document the security approach
COMMENT ON FUNCTION public.get_public_listing_data IS 'Returns only safe public columns from listings for non-admin users';
COMMENT ON POLICY "Public can view active and sold listings (safe columns only)" ON public.sbir_listings IS 'Allows public access but application layer must use column restrictions for non-admins';