
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SBIRListing {
  id: string;
  title: string;
  description: string;
  phase: 'Phase I' | 'Phase II';
  agency: string;
  value: number;
  deadline: string;
  category: string;
  status: 'Active' | 'Pending' | 'Sold' | 'Rejected';
  submitted_at: string;
  user_id: string;
}

export const useListings = () => {
  const [listings, setListings] = useState<SBIRListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('sbir_listings')
        .select('*')
        .order('created_at', { ascending: false });

      // If not admin, only show active listings and user's own listings
      if (!isAdmin) {
        if (user) {
          query = query.or(`status.eq.Active,user_id.eq.${user.id}`);
        } else {
          query = query.eq('status', 'Active');
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Convert value from cents to dollars and format dates
      const formattedListings = data?.map(listing => ({
        ...listing,
        value: listing.value / 100, // Convert cents to dollars
        deadline: new Date(listing.deadline).toISOString().split('T')[0]
      })) || [];

      setListings(formattedListings);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (listingData: Omit<SBIRListing, 'id' | 'submitted_at' | 'user_id' | 'status'>) => {
    if (!user) {
      throw new Error('Must be authenticated to create listings');
    }

    try {
      const { data, error } = await supabase
        .from('sbir_listings')
        .insert({
          ...listingData,
          value: Math.round(listingData.value * 100), // Convert dollars to cents
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await fetchListings(); // Refresh listings
      return data;
    } catch (err) {
      console.error('Error creating listing:', err);
      throw err;
    }
  };

  const approveListing = async (listingId: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can approve listings');
    }

    try {
      const { error } = await supabase
        .from('sbir_listings')
        .update({ 
          status: 'Active',
          approved_at: new Date().toISOString(),
          approved_by: user?.id
        })
        .eq('id', listingId);

      if (error) throw error;

      await fetchListings(); // Refresh listings
    } catch (err) {
      console.error('Error approving listing:', err);
      throw err;
    }
  };

  const rejectListing = async (listingId: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can reject listings');
    }

    try {
      const { error } = await supabase
        .from('sbir_listings')
        .update({ status: 'Rejected' })
        .eq('id', listingId);

      if (error) throw error;

      await fetchListings(); // Refresh listings
    } catch (err) {
      console.error('Error rejecting listing:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchListings();
  }, [user, isAdmin]);

  return {
    listings,
    loading,
    error,
    fetchListings,
    createListing,
    approveListing,
    rejectListing
  };
};
