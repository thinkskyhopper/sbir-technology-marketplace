
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
      console.log('🔄 Creating listing operation...', { user: user.id, isAdmin });
      
      const data = await listingsService.createListing(listingData, user.id);
      console.log('✅ Listing created in database:', data.id);
      
      // Send admin notification for new listing - only for Pending status
      if (data && data.status === 'Pending') {
        console.log('🔔 Sending admin notification for new pending listing...');
        try {
          await sendNewListingNotification(data);
          console.log('✅ Admin notification process completed');
        } catch (notificationError) {
          console.error('❌ Admin notification failed, but listing was created successfully:', notificationError);
          // Don't fail the listing creation if notification fails
        }
      } else {
        console.log('ℹ️ Skipping admin notification - listing status is not Pending:', data?.status);
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

  const updateListing = async (listingId: string, listingData: UpdateListingData, adminNotes?: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can update listings');
    }

    if (!user) {
      throw new Error('Must be authenticated to update listings');
    }

    try {
      setLoading(true);
      console.log('🔄 Updating listing operation...', { listingId, isAdmin });
      
      // Use the audit-enabled update function for admin edits
      await listingsService.updateListingWithAudit(listingId, listingData, user.id, adminNotes);
      
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
