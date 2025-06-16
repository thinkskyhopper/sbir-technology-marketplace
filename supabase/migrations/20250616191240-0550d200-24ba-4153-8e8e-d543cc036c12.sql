
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Create enum for SBIR phases
CREATE TYPE public.sbir_phase AS ENUM ('Phase I', 'Phase II');

-- Create enum for listing status
CREATE TYPE public.listing_status AS ENUM ('Active', 'Pending', 'Sold', 'Rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create SBIR listings table
CREATE TABLE public.sbir_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  phase sbir_phase NOT NULL,
  agency TEXT NOT NULL,
  value BIGINT NOT NULL, -- Store in cents to avoid decimal issues
  deadline DATE NOT NULL,
  category TEXT NOT NULL,
  status listing_status NOT NULL DEFAULT 'Pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create contact inquiries table for secure admin communication
CREATE TABLE public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.sbir_listings(id) ON DELETE CASCADE,
  inquirer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sbir_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

-- RLS Policies for SBIR listings
CREATE POLICY "Anyone can view active listings"
  ON public.sbir_listings FOR SELECT
  USING (status = 'Active');

CREATE POLICY "Users can view their own listings"
  ON public.sbir_listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all listings"
  ON public.sbir_listings FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can create listings"
  ON public.sbir_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own pending listings"
  ON public.sbir_listings FOR UPDATE
  USING (auth.uid() = user_id AND status = 'Pending');

CREATE POLICY "Admins can update any listing"
  ON public.sbir_listings FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- RLS Policies for contact inquiries
CREATE POLICY "Users can view their own inquiries"
  ON public.contact_inquiries FOR SELECT
  USING (auth.uid() = inquirer_id);

CREATE POLICY "Listing owners can view inquiries for their listings"
  ON public.contact_inquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sbir_listings 
      WHERE id = listing_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all inquiries"
  ON public.contact_inquiries FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can create inquiries"
  ON public.contact_inquiries FOR INSERT
  WITH CHECK (auth.uid() = inquirer_id AND auth.uid() IS NOT NULL);

-- Create trigger function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sbir_listings_updated_at
  BEFORE UPDATE ON public.sbir_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
