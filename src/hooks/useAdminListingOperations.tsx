
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listingsService } from '@/services/listingsService';

export const useAdminListingOperations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();

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
      
      await listingsService.hideListing(listingId);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('❌ Error hiding listing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (listingId: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can delete listings');
    }

    try {
      setLoading(true);
      console.log('🔄 Deleting listing operation...', { listingId });
      
      await listingsService.deleteListing(listingId);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('❌ Error deleting listing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    approveListing,
    rejectListing,
    hideListing,
    deleteListing,
    loading
  };
};
