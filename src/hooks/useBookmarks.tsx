
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { SBIRListing } from '@/types/listings';

export const useBookmarks = () => {
  const [bookmarkedListings, setBookmarkedListings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's bookmarked listing IDs
  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarkedListings([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('listing_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setBookmarkedListings(data?.map(bookmark => bookmark.listing_id) || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to load bookmarks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Fetch bookmarked listings with full details
  const fetchBookmarkedListings = useCallback(async (): Promise<SBIRListing[]> => {
    if (!user) {
      return [];
    }

    try {
      // First fetch the user's bookmarks to get the listing IDs
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('user_bookmarks')
        .select('listing_id')
        .eq('user_id', user.id);

      if (bookmarksError) throw bookmarksError;

      const listingIds = bookmarks?.map(bookmark => bookmark.listing_id) || [];
      
      if (listingIds.length === 0) {
        return [];
      }

      // Then fetch the full listing details
      const { data, error } = await supabase
        .from('sbir_listings')
        .select('*')
        .in('id', listingIds)
        .eq('status', 'Active') // Only show active listings
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert value from cents to dollars
      return data?.map(listing => ({
        ...listing,
        value: listing.value / 100,
        profiles: null
      })) || [];
    } catch (error) {
      console.error('Error fetching bookmarked listings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookmarked listings",
        variant: "destructive",
      });
      return [];
    }
  }, [user, toast]);

  // Add a bookmark
  const addBookmark = useCallback(async (listingId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark listings",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .insert({
          user_id: user.id,
          listing_id: listingId
        });

      if (error) throw error;

      setBookmarkedListings(prev => [...prev, listingId]);
      toast({
        title: "Bookmarked",
        description: "Listing added to your bookmarks",
        duration: 5000,
      });
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to bookmark listing",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Remove a bookmark
  const removeBookmark = useCallback(async (listingId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (error) throw error;

      setBookmarkedListings(prev => prev.filter(id => id !== listingId));
      toast({
        title: "Bookmark removed",
        description: "Listing removed from your bookmarks",
        duration: 5000,
      });
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Toggle bookmark
  const toggleBookmark = useCallback(async (listingId: string) => {
    const isBookmarked = bookmarkedListings.includes(listingId);
    
    if (isBookmarked) {
      return await removeBookmark(listingId);
    } else {
      return await addBookmark(listingId);
    }
  }, [bookmarkedListings, addBookmark, removeBookmark]);

  // Check if a listing is bookmarked
  const isBookmarked = useCallback((listingId: string) => {
    return bookmarkedListings.includes(listingId);
  }, [bookmarkedListings]);

  // Load bookmarks when user changes
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarkedListings,
    loading,
    fetchBookmarkedListings,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    refetchBookmarks: fetchBookmarks
  };
};
