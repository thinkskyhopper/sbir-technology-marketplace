-- Update listing-photos bucket to enforce allowed MIME types
UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']::text[],
  file_size_limit = 5242880  -- 5MB in bytes
WHERE id = 'listing-photos';