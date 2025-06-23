import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listingsService } from '@/services/listingsService';
import { adminNotificationService } from '@/services/adminNotificationService';
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
      console.log('🔄 Creating listing operation...', { user: user.id });
      
      const data = await listingsService.createListing(listingData, user.id);
      
      // Send admin notification for new listing
      if (data && listingData.status === 'Pending') {
        console.log('🔔 Triggering admin notification for new listing...');
        
        // Get user profile data for the notification
        const { data: userProfile } = await import('@/integrations/supabase/client').then(({ supabase }) =>
          supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', user.id)
            .single()
        );

        if (userProfile) {
          await adminNotificationService.notifyAdminsOfNewListing(
            {
              id: data.id,
              title: data.title,
              agency: data.agency,
              value: data.value,
              phase: data.phase,
              category: data.category,
              description: data.description
            },
            {
              full_name: userProfile.full_name || 'Unknown User',
              email: userProfile.email
            }
          );
        }
      }
      
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

  const approveListing = async (listingId: string) => {
    if (!isAdmin || !user) {
      throw new Error('Only admins can approve listings');
    }

    try {
      setLoading(true);
      console.log('🔄 Approving listing operation...', { listingId, adminId: user.id });
      
      await listingsService.approveListing(listingId, user.id);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('❌ Error approving listing:', err);
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
      console.log('🔄 Rejecting listing operation...', { listingId });
      
      await listingsService.rejectListing(listingId);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('❌ Error rejecting listing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hideListing = async (listingId: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can hide listings');
    }

    try {
      setLoading(true);
      console.log('🔄 Hiding listing operation...', { listingId });
      
      await listingsService.updateListing(listingId, { status: 'Hidden' } as UpdateListingData);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('❌ Error hiding listing:', err);
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
    hideListing,
    loading
  };
};
