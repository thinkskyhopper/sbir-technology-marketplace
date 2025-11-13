import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listingsService } from '@/services/listingsService';
import { useListingOperations } from '@/hooks/useListingOperations';
import type { SBIRListing } from '@/types/listings';

const LISTINGS_QUERY_KEY = ['listings'];

export const useListings = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...LISTINGS_QUERY_KEY, isAdmin, user?.id],
    queryFn: async () => {
      console.log('📊 Fetching listings via React Query...', { isAdmin, userId: user?.id });
      return await listingsService.fetchListings(isAdmin, user?.id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount, error: any) => {
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const refreshListings = useCallback(() => {
    console.log('🔄 Invalidating listings cache...');
    queryClient.invalidateQueries({ queryKey: LISTINGS_QUERY_KEY });
  }, [queryClient]);

  const {
    createListing: createListingOperation,
    updateListing: updateListingOperation,
    approveListing,
    rejectListing,
    hideListing,
    deleteListing
  } = useListingOperations(refreshListings);

  const createListing = createListingOperation;

  const updateListing = useCallback(
    async (listingId: string, listingData: any, adminNotes?: string) => {
      return updateListingOperation(listingId, listingData, adminNotes);
    },
    [updateListingOperation]
  );

  return useMemo(() => ({
    listings: query.data || [],
    loading: query.isLoading,
    error: query.error ? String(query.error) : null,
    fetchListings: refreshListings,
    createListing,
    updateListing,
    approveListing,
    rejectListing,
    hideListing,
    deleteListing
  }), [
    query.data,
    query.isLoading,
    query.error,
    refreshListings,
    createListing,
    updateListing,
    approveListing,
    rejectListing,
    hideListing,
    deleteListing
  ]);
};
