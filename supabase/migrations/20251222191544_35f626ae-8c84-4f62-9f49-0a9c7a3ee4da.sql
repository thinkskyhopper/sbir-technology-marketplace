-- Drop and recreate get_public_listings_with_profiles to include public_id
DROP FUNCTION IF EXISTS public.get_public_listings_with_profiles();

CREATE FUNCTION public.get_public_listings_with_profiles()
 RETURNS TABLE(id uuid, public_id text, title text, description text, phase sbir_phase, agency text, value bigint, deadline date, category text, status listing_status, submitted_at timestamp with time zone, approved_at timestamp with time zone, user_id uuid, photo_url text, date_sold timestamp with time zone, technology_summary text, listing_type listing_type, created_at timestamp with time zone, updated_at timestamp with time zone, profile_full_name text, profile_first_name text, profile_last_name text, profile_company_name text, profile_bio text, profile_role user_role, recommended_affiliate_1_id uuid, recommended_affiliate_1_full_name text, recommended_affiliate_1_photo_url text, recommended_affiliate_2_id uuid, recommended_affiliate_2_full_name text, recommended_affiliate_2_photo_url text)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT 
    sl.id, sl.public_id, sl.title, sl.description, sl.phase, sl.agency, sl.value, sl.deadline, sl.category,
    sl.status, sl.submitted_at, sl.approved_at, sl.user_id, sl.photo_url, sl.date_sold,
    sl.technology_summary, sl.listing_type, sl.created_at, sl.updated_at,
    p.full_name as profile_full_name, p.first_name as profile_first_name,
    p.last_name as profile_last_name, p.company_name as profile_company_name,
    p.bio as profile_bio, p.role as profile_role,
    sl.recommended_affiliate_1_id, aff1.full_name as recommended_affiliate_1_full_name,
    aff1.photo_url as recommended_affiliate_1_photo_url,
    sl.recommended_affiliate_2_id, aff2.full_name as recommended_affiliate_2_full_name,
    aff2.photo_url as recommended_affiliate_2_photo_url
  FROM sbir_listings sl
  LEFT JOIN profiles p ON sl.user_id = p.id
  LEFT JOIN profiles aff1 ON sl.recommended_affiliate_1_id = aff1.id AND aff1.account_deleted = false
  LEFT JOIN profiles aff2 ON sl.recommended_affiliate_2_id = aff2.id AND aff2.account_deleted = false
  WHERE sl.status IN ('Active', 'Sold') AND p.account_deleted = false
  ORDER BY sl.created_at DESC;
$$;