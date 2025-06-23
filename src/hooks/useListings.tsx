
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listingsService } from '@/services/listingsService';
import { useListingOperations } from '@/hooks/useListingOperations';
import type { SBIRListing } from '@/types/listings';

export const useListings = () => {
  const [listings, setListings] = useState<SBIRListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  
  // Track if data has been loaded to prevent unnecessary refetching
  const hasLoadedRef = useRef(false);
  const currentUserIdRef = useRef<string | undefined>();
  const currentIsAdminRef = useRef<boolean>(false);

  const fetchListings = useCallback(async (force = false) => {
    // Only fetch if forced or if auth state has changed
    if (!force && 
        hasLoadedRef.current && 
        currentUserIdRef.current === user?.id && 
        currentIsAdminRef.current === isAdmin) {
      console.log('📊 Skipping listings fetch - data already loaded and auth unchanged');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('📊 Fetching listings...', { isAdmin, userId: user?.id });

      const data = await listingsService.fetchListings(isAdmin, user?.id);
      setListings(data);
      hasLoadedRef.current = true;
      currentUserIdRef.current = user?.id;
      currentIsAdminRef.current = isAdmin;
      console.log('✅ Listings fetched successfully:', data.length);
    } catch (err) {
      console.error('❌ Error fetching listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      hasLoadedRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAdmin]);

  // Memoized refresh function that forces a fetch
  const refreshListings = useCallback(() => {
    console.log('🔄 Forcing listings refresh...');
    fetchListings(true);
  }, [fetchListings]);

  const {
    createListing,
    updateListing,
    approveListing,
    rejectListing,
    hideListing
  } = useListingOperations(refreshListings);

  // Initial fetch when auth state changes significantly
  useEffect(() => {
    // Only fetch if we haven't loaded data yet, or if the user/admin status changed
    if (!hasLoadedRef.current || 
        currentUserIdRef.current !== user?.id || 
        currentIsAdminRef.current !== isAdmin) {
      fetchListings();
    }
  }, [fetchListings]);

  // Cleanup function to reset state on unmount
  useEffect(() => {
    return () => {
      hasLoadedRef.current = false;
      currentUserIdRef.current = undefined;
      currentIsAdminRef.current = false;
    };
  }, []);

  // Memoized the return object to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    listings,
    loading,
    error,
    fetchListings: refreshListings,
    createListing,
    updateListing,
    approveListing,
    rejectListing,
    hideListing
  }), [
    listings,
    loading,
    error,
    refreshListings,
    createListing,
    updateListing,
    approveListing,
    rejectListing,
    hideListing
  ]);

  return returnValue;
};
