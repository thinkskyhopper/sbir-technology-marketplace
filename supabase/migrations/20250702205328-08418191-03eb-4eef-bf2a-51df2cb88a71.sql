
-- Create enum for admin action types
CREATE TYPE public.admin_action_type AS ENUM ('approval', 'denial', 'edit', 'deletion');

-- Create table to store admin audit logs
CREATE TABLE public.admin_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES public.sbir_listings(id) ON DELETE SET NULL,
  listing_title TEXT NOT NULL,
  listing_agency TEXT NOT NULL,
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type public.admin_action_type NOT NULL,
  internal_notes TEXT,
  user_notes TEXT,
  user_notified BOOLEAN NOT NULL DEFAULT false,
  changes_made JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the audit logs table
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view audit logs
CREATE POLICY "Admins can view all audit logs" 
  ON public.admin_audit_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Only admins can create audit logs
CREATE POLICY "Admins can create audit logs" 
  ON public.admin_audit_logs 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add index for performance
CREATE INDEX idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX idx_admin_audit_logs_listing_id ON public.admin_audit_logs(listing_id);
CREATE INDEX idx_admin_audit_logs_admin_id ON public.admin_audit_logs(admin_id);
