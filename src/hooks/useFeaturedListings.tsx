
import { useState, useCallback } from 'react';
import { featuredListingsService } from '@/services/featuredListings';
import type { SBIRListing } from '@/types/listings';

export const useFeaturedListings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHomepageListings = useCallback(async (): Promise<SBIRListing[]> => {
    try {
      setLoading(true);
      setError(null);
      const listings = await featuredListingsService.getHomepageListings();
      return listings;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch homepage listings';
      setError(errorMessage);
      console.error('❌ Error in getHomepageListings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeaturedListings = useCallback(async (): Promise<SBIRListing[]> => {
    try {
      setLoading(true);
      setError(null);
      const listings = await featuredListingsService.getFeaturedListings();
      return listings;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch featured listings';
      setError(errorMessage);
      console.error('❌ Error in getFeaturedListings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addFeaturedListing = useCallback(async (listingId: string, displayOrder: number) => {
    try {
      setLoading(true);
      setError(null);
      await featuredListingsService.addFeaturedListing(listingId, displayOrder);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add featured listing';
      setError(errorMessage);
      console.error('❌ Error in addFeaturedListing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFeaturedListing = useCallback(async (listingId: string) => {
    try {
      setLoading(true);
      setError(null);
      await featuredListingsService.removeFeaturedListing(listingId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove featured listing';
      setError(errorMessage);
      console.error('❌ Error in removeFeaturedListing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDisplayOrder = useCallback(async (listingId: string, displayOrder: number) => {
    try {
      setLoading(true);
      setError(null);
      await featuredListingsService.updateDisplayOrder(listingId, displayOrder);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update display order';
      setError(errorMessage);
      console.error('❌ Error in updateDisplayOrder:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getHomepageListings,
    getFeaturedListings,
    addFeaturedListing,
    removeFeaturedListing,
    updateDisplayOrder
  };
};
