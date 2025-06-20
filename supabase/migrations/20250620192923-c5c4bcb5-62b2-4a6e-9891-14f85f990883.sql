
-- First, let's make sure the category-images bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure RLS policies exist for the category-images bucket
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view category images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload category images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update category images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete category images" ON storage.objects;

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
