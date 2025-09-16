-- Ensure authenticated role can access the public schema and required resources
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant minimal required table privileges (RLS still applies)
GRANT INSERT, SELECT ON TABLE public.sbir_listings TO authenticated;

-- Grant usage on enum types used by sbir_listings
GRANT USAGE ON TYPE public.sbir_phase TO authenticated;
GRANT USAGE ON TYPE public.listing_status TO authenticated;