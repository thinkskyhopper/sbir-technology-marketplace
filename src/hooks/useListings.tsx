
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listingsService } from '@/services/listingsService';
import { useListingOperations } from '@/hooks/useListingOperations';
import type { SBIRListing } from '@/types/listings';

export const useListings = () => {
  const [listings, setListings] = useState<SBIRListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await listingsService.fetchListings(isAdmin, user?.id);
      setListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const {
    createListing,
    updateListing,
    approveListing,
    rejectListing
  } = useListingOperations(fetchListings);

  useEffect(() => {
    fetchListings();
  }, [user, isAdmin]);

  return {
    listings,
    loading,
    error,
    fetchListings,
    createListing,
    updateListing,
    approveListing,
    rejectListing
  };
};

// Re-export types for backward compatibility
export type { SBIRListing } from '@/types/listings';
