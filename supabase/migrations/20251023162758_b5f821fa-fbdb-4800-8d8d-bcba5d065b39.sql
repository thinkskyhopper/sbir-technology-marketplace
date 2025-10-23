-- Migration: Copy internal_title and internal_description to public fields
-- This migration safely copies internal admin fields to public-facing fields

-- Step 1: Create backup columns to preserve original data
ALTER TABLE sbir_listings 
ADD COLUMN IF NOT EXISTS title_backup text,
ADD COLUMN IF NOT EXISTS description_backup text;

-- Step 2: Copy current values to backup columns
UPDATE sbir_listings
SET 
  title_backup = title,
  description_backup = description;

-- Step 3: Copy internal_title to title (only where internal_title has a value)
UPDATE sbir_listings
SET title = internal_title
WHERE internal_title IS NOT NULL 
  AND internal_title != '';

-- Step 4: Copy internal_description to description (only where internal_description has a value)
UPDATE sbir_listings
SET description = internal_description
WHERE internal_description IS NOT NULL 
  AND internal_description != '';

-- Verification queries (run these after migration to verify):
-- SELECT COUNT(*) as total_listings FROM sbir_listings;
-- SELECT COUNT(*) as updated_titles FROM sbir_listings WHERE title != title_backup;
-- SELECT COUNT(*) as updated_descriptions FROM sbir_listings WHERE description != description_backup;
-- SELECT id, title, title_backup, internal_title FROM sbir_listings WHERE title != title_backup LIMIT 5;