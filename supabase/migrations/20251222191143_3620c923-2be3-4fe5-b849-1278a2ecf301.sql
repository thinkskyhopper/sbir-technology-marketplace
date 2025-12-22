-- Add public_id column to sbir_listings
ALTER TABLE public.sbir_listings
ADD COLUMN public_id text;

-- Create unique index for public_id
CREATE UNIQUE INDEX idx_sbir_listings_public_id ON public.sbir_listings(public_id);

-- Create trigger to auto-generate public_id on insert
CREATE OR REPLACE FUNCTION public.set_listing_public_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.public_id IS NULL THEN
    NEW.public_id := public.generate_public_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_sbir_listings_public_id
  BEFORE INSERT ON public.sbir_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_listing_public_id();

-- Backfill existing listings with generated public_ids
UPDATE public.sbir_listings
SET public_id = public.generate_public_id()
WHERE public_id IS NULL;

-- Now make the column NOT NULL after backfill
ALTER TABLE public.sbir_listings
ALTER COLUMN public_id SET NOT NULL;

-- Create function to get listing by identifier (UUID or public_id)
CREATE OR REPLACE FUNCTION public.get_listing_by_identifier(identifier text)
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
  updated_at timestamp with time zone,
  company text,
  address text,
  contract text,
  contract_end_date date,
  proposal_award_date date,
  topic_code text,
  agency_tracking_number text,
  primary_investigator_name text,
  pi_email text,
  pi_phone text,
  business_contact_name text,
  bc_email text,
  bc_phone text,
  recommended_affiliate_1_id uuid,
  recommended_affiliate_2_id uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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
    sl.updated_at,
    sl.company,
    sl.address,
    sl.contract,
    sl.contract_end_date,
    sl.proposal_award_date,
    sl.topic_code,
    sl.agency_tracking_number,
    sl.primary_investigator_name,
    sl.pi_email,
    sl.pi_phone,
    sl.business_contact_name,
    sl.bc_email,
    sl.bc_phone,
    sl.recommended_affiliate_1_id,
    sl.recommended_affiliate_2_id
  FROM public.sbir_listings sl
  WHERE (sl.id::text = identifier OR sl.public_id = identifier)
    AND sl.status IN ('Active', 'Sold');
$$;

-- Create admin version that returns all listings regardless of status
CREATE OR REPLACE FUNCTION public.get_listing_by_identifier_admin(identifier text)
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
  updated_at timestamp with time zone,
  company text,
  address text,
  contract text,
  contract_end_date date,
  proposal_award_date date,
  topic_code text,
  agency_tracking_number text,
  primary_investigator_name text,
  pi_email text,
  pi_phone text,
  business_contact_name text,
  bc_email text,
  bc_phone text,
  recommended_affiliate_1_id uuid,
  recommended_affiliate_2_id uuid,
  internal_title text,
  internal_description text,
  title_backup text,
  description_backup text,
  approved_by uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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
    sl.updated_at,
    sl.company,
    sl.address,
    sl.contract,
    sl.contract_end_date,
    sl.proposal_award_date,
    sl.topic_code,
    sl.agency_tracking_number,
    sl.primary_investigator_name,
    sl.pi_email,
    sl.pi_phone,
    sl.business_contact_name,
    sl.bc_email,
    sl.bc_phone,
    sl.recommended_affiliate_1_id,
    sl.recommended_affiliate_2_id,
    sl.internal_title,
    sl.internal_description,
    sl.title_backup,
    sl.description_backup,
    sl.approved_by
  FROM public.sbir_listings sl
  WHERE (sl.id::text = identifier OR sl.public_id = identifier)
    AND current_user_is_admin();
$$;