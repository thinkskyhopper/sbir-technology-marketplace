
-- Add promotions column to store multiple promotions as JSON
ALTER TABLE team_members 
ADD COLUMN promotions jsonb DEFAULT '[]'::jsonb;
