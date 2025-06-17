
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listingsService } from '@/services/listingsService';
import type { CreateListingData, UpdateListingData } from '@/types/listings';

export const useListingOperations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  const createListing = async (listingData: CreateListingData) => {
    if (!user) {
      throw new Error('Must be authenticated to create listings');
    }

    try {
      setLoading(true);
      const data = await listingsService.createListing(listingData, user.id);
      if (onSuccess) onSuccess();
      return data;
    } catch (err) {
      console.error('Error creating listing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateListing = async (listingId: string, listingData: UpdateListingData) => {
    if (!isAdmin) {
      throw new Error('Only admins can update listings');
    }

    try {
      setLoading(true);
      await listingsService.updateListing(listingId, listingData);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error updating listing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveListing = async (listingId: string) => {
    if (!isAdmin || !user) {
      throw new Error('Only admins can approve listings');
    }

    try {
      setLoading(true);
      await listingsService.approveListing(listingId, user.id);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error approving listing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectListing = async (listingId: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can reject listings');
    }

    try {
      setLoading(true);
      await listingsService.rejectListing(listingId);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error rejecting listing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createListing,
    updateListing,
    approveListing,
    rejectListing,
    loading
  };
};
