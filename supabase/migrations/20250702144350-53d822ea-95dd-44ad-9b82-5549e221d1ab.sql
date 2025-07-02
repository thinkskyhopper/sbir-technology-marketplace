
-- Create a table for user bookmarks
CREATE TABLE public.user_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.sbir_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

-- Add Row Level Security (RLS) to ensure users can only see their own bookmarks
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own bookmarks
CREATE POLICY "Users can view their own bookmarks" 
  ON public.user_bookmarks 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own bookmarks
CREATE POLICY "Users can create their own bookmarks" 
  ON public.user_bookmarks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own bookmarks
CREATE POLICY "Users can delete their own bookmarks" 
  ON public.user_bookmarks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_bookmarks_user_id ON public.user_bookmarks(user_id);
CREATE INDEX idx_user_bookmarks_listing_id ON public.user_bookmarks(listing_id);
