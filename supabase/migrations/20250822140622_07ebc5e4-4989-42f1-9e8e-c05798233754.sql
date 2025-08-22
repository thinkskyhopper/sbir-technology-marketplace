-- Make deadline column nullable to allow new records without deadline values
-- This preserves all existing data while making the field optional for new submissions
ALTER TABLE public.sbir_listings ALTER COLUMN deadline DROP NOT NULL;