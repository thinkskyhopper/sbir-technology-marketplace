
-- Add new fields to the sbir_listings table
ALTER TABLE public.sbir_listings 
ADD COLUMN agency_tracking_number TEXT,
ADD COLUMN contract TEXT,
ADD COLUMN proposal_award_date DATE,
ADD COLUMN contract_end_date DATE,
ADD COLUMN topic_code TEXT,
ADD COLUMN company TEXT,
ADD COLUMN address TEXT,
ADD COLUMN primary_investigator_name TEXT,
ADD COLUMN pi_phone TEXT,
ADD COLUMN pi_email TEXT,
ADD COLUMN business_contact_name TEXT,
ADD COLUMN bc_phone TEXT,
ADD COLUMN bc_email TEXT;

-- Add comments to explain the new fields
COMMENT ON COLUMN public.sbir_listings.agency_tracking_number IS 'Agency-specific tracking number for the SBIR listing';
COMMENT ON COLUMN public.sbir_listings.contract IS 'Contract information for the SBIR listing';
COMMENT ON COLUMN public.sbir_listings.proposal_award_date IS 'Date when the proposal was awarded';
COMMENT ON COLUMN public.sbir_listings.contract_end_date IS 'End date of the contract';
COMMENT ON COLUMN public.sbir_listings.topic_code IS 'Topic code associated with the SBIR listing';
COMMENT ON COLUMN public.sbir_listings.company IS 'Company name associated with the SBIR listing';
COMMENT ON COLUMN public.sbir_listings.address IS 'Address of the company or contact';
COMMENT ON COLUMN public.sbir_listings.primary_investigator_name IS 'Name of the primary investigator';
COMMENT ON COLUMN public.sbir_listings.pi_phone IS 'Phone number of the primary investigator';
COMMENT ON COLUMN public.sbir_listings.pi_email IS 'Email address of the primary investigator';
COMMENT ON COLUMN public.sbir_listings.business_contact_name IS 'Name of the business contact';
COMMENT ON COLUMN public.sbir_listings.bc_phone IS 'Phone number of the business contact';
COMMENT ON COLUMN public.sbir_listings.bc_email IS 'Email address of the business contact';
