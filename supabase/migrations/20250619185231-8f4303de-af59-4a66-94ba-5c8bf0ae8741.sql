
-- Create a table for team members
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo_url TEXT,
  promotion_title TEXT,
  promotion_description TEXT,
  promotion_photo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to the team_members table
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to SELECT team members (public page)
CREATE POLICY "Anyone can view team members" 
  ON public.team_members 
  FOR SELECT 
  USING (true);

-- Create policy that allows only admins to INSERT team members
CREATE POLICY "Only admins can create team members" 
  ON public.team_members 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy that allows only admins to UPDATE team members
CREATE POLICY "Only admins can update team members" 
  ON public.team_members 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy that allows only admins to DELETE team members
CREATE POLICY "Only admins can delete team members" 
  ON public.team_members 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add trigger to update the updated_at column
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
