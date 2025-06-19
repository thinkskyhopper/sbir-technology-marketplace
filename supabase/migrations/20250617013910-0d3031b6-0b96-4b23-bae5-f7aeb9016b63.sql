
-- Create a storage bucket for listing photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', true);

-- Create RLS policies for the listing-photos bucket
CREATE POLICY "Anyone can view listing photos" ON storage.objects
FOR SELECT USING (bucket_id = 'listing-photos');

CREATE POLICY "Admins can upload listing photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'listing-photos' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update listing photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'listing-photos' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete listing photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'listing-photos' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Create a storage bucket for category images
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true);

-- Create RLS policies for the category-images bucket
CREATE POLICY "Anyone can view category images" ON storage.objects
FOR SELECT USING (bucket_id = 'category-images');

CREATE POLICY "Admins can upload category images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'category-images' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update category images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'category-images' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete category images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'category-images' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Add photo_url column to sbir_listings table
ALTER TABLE sbir_listings ADD COLUMN photo_url TEXT;
