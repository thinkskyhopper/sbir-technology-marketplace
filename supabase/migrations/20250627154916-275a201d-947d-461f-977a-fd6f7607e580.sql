
-- Create a table to store admin-selected featured listings
CREATE TABLE public.featured_listings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid NOT NULL REFERENCES public.sbir_listings(id) ON DELETE CASCADE,
  display_order integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NOT NULL REFERENCES public.profiles(id),
  UNIQUE(listing_id),
  CHECK (display_order >= 1 AND display_order <= 6)
);

-- Enable RLS
ALTER TABLE public.featured_listings ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to manage featured listings
CREATE POLICY "Admins can manage featured listings" 
  ON public.featured_listings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy to allow everyone to view featured listings (for public display)
CREATE POLICY "Everyone can view featured listings" 
  ON public.featured_listings 
  FOR SELECT 
  USING (true);

-- Create index for better performance
CREATE INDEX idx_featured_listings_display_order ON public.featured_listings(display_order);
