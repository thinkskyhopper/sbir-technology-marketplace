
-- Add Phase III to the existing sbir_phase enum
ALTER TYPE public.sbir_phase ADD VALUE 'Phase III';

-- Create a table to store admin configuration for phase III badge placement
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Insert default setting for Phase III badge corner position
INSERT INTO public.admin_settings (setting_key, setting_value, created_by)
VALUES ('phase_iii_badge_corner', 'top-right', NULL);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin settings
CREATE POLICY "Admins can manage admin settings" 
  ON public.admin_settings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow all users to read admin settings (for displaying the badge)
CREATE POLICY "Users can read admin settings" 
  ON public.admin_settings 
  FOR SELECT 
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
