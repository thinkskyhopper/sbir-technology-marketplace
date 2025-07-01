
-- Add date_sold column to track when a listing was marked as sold
ALTER TABLE public.sbir_listings 
ADD COLUMN date_sold timestamp with time zone;

-- Add technology_summary column for sold listings display
ALTER TABLE public.sbir_listings 
ADD COLUMN technology_summary text;

-- Create a trigger function to automatically set date_sold when status changes to 'Sold'
CREATE OR REPLACE FUNCTION public.set_date_sold()
RETURNS TRIGGER AS $$
BEGIN
    -- If status is being changed to 'Sold' and it wasn't 'Sold' before
    IF NEW.status = 'Sold' AND (OLD.status IS NULL OR OLD.status != 'Sold') THEN
        NEW.date_sold = NOW();
    -- If status is being changed away from 'Sold', clear the date_sold
    ELSIF NEW.status != 'Sold' AND OLD.status = 'Sold' THEN
        NEW.date_sold = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER trigger_set_date_sold
    BEFORE UPDATE ON public.sbir_listings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_date_sold();

-- Add comment to explain the new columns
COMMENT ON COLUMN public.sbir_listings.date_sold IS 'Timestamp when the listing status was changed to Sold';
COMMENT ON COLUMN public.sbir_listings.technology_summary IS '3-5 word summary of the technology for display when sold';
