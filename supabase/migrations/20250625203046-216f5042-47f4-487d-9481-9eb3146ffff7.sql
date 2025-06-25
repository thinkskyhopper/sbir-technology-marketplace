
-- Create enum for change request types
CREATE TYPE public.change_request_type AS ENUM ('change', 'deletion');

-- Create enum for change request status
CREATE TYPE public.change_request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create table to store change requests
CREATE TABLE public.listing_change_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.sbir_listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  request_type public.change_request_type NOT NULL,
  requested_changes JSONB,
  reason TEXT,
  status public.change_request_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  processed_by UUID,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the change requests table
ALTER TABLE public.listing_change_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own change requests
CREATE POLICY "Users can view their own change requests" 
  ON public.listing_change_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can create change requests for their own listings
CREATE POLICY "Users can create change requests for their listings" 
  ON public.listing_change_requests 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.sbir_listings 
      WHERE id = listing_id AND user_id = auth.uid()
    )
  );

-- Policy: Admins can view all change requests
CREATE POLICY "Admins can view all change requests" 
  ON public.listing_change_requests 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can update change requests
CREATE POLICY "Admins can update change requests" 
  ON public.listing_change_requests 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add trigger to update the updated_at column
CREATE TRIGGER update_listing_change_requests_updated_at
  BEFORE UPDATE ON public.listing_change_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
