
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listingsService } from '@/services/listingsService';
import { useAdminNotification } from './useAdminNotification';
import type { CreateListingData, UpdateListingData } from '@/types/listings';

export const useBasicListingOperations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();
  const { sendNewListingNotification } = useAdminNotification();

  const createListing = async (listingData: CreateListingData) => {
    if (!user) {
      throw new Error('Must be authenticated to create listings');
    }

    try {
      setLoading(true);
      console.log('🔄 Creating listing operation...', { user: user.id });
      
      const data = await listingsService.createListing(listingData, user.id);
      console.log('✅ Listing created in database:', data.id);
      
      // Send admin notification for new listing
      if (data && listingData.status === 'Pending') {
        await sendNewListingNotification(data);
      }
      
      console.log('✅ Listing creation process completed successfully');
      
      if (onSuccess) onSuccess();
      return data;
    } catch (err) {
      console.error('❌ Error creating listing:', err);
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
      console.log('🔄 Updating listing operation...', { listingId, isAdmin });
      
      await listingsService.updateListing(listingId, listingData);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('❌ Error updating listing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createListing,
    updateListing,
    loading
  };
};
