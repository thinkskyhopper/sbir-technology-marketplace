import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTabVisibility } from './useTabVisibility';
import { listingsService } from '@/services/listings';
import { useAuth } from '@/contexts/AuthContext';

const ADMIN_LISTINGS_QUERY_KEY = ['admin-listings'];
const PUBLIC_LISTINGS_QUERY_KEY = ['listings'];

export const useOptimizedAdminListings = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const isTabVisible = useTabVisibility();

  const query = useQuery({
    queryKey: ADMIN_LISTINGS_QUERY_KEY,
    queryFn: async () => {
      console.log('📊 Fetching admin listings data...');
      return await listingsService.fetchListings(true, user?.id);
    },
    enabled: !!user && isAdmin,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: isTabVisible ? 5 * 60 * 1000 : false, // Refetch every 5 minutes if tab is visible
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Optimized invalidation method
  const invalidateAdminListings = () => {
    queryClient.invalidateQueries({ 
      queryKey: ADMIN_LISTINGS_QUERY_KEY,
      exact: true 
    });
  };

  // Invalidate BOTH admin and public listings caches
  const invalidateAllListingsData = () => {
    // Invalidate admin cache
    queryClient.invalidateQueries({ 
      queryKey: ADMIN_LISTINGS_QUERY_KEY,
      exact: true 
    });
    
    // Invalidate ALL public listing caches (matches ['listings', ...])
    queryClient.invalidateQueries({ 
      queryKey: PUBLIC_LISTINGS_QUERY_KEY,
    });
    
    console.log('🔄 Invalidated both admin and public listings caches');
  };

  // Prefetch related data
  const prefetchAdminListings = () => {
    queryClient.prefetchQuery({
      queryKey: ADMIN_LISTINGS_QUERY_KEY,
      queryFn: () => listingsService.fetchListings(true, user?.id),
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    ...query,
    invalidateAdminListings,
    invalidateAllListingsData,
    prefetchAdminListings,
  };
};