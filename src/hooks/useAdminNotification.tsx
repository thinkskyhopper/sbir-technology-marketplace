
import { useAuth } from '@/contexts/AuthContext';
import { adminNotificationService } from '@/services/adminNotificationService';
import type { SBIRListing } from '@/types/listings';

export const useAdminNotification = () => {
  const { user } = useAuth();

  const sendNewListingNotification = async (listing: SBIRListing) => {
    if (!user || listing.status !== 'Pending') {
      console.log('ℹ️ Admin notification skipped:', {
        hasUser: !!user,
        status: listing.status,
        reason: !user ? 'No user' : 'Status not Pending'
      });
      return;
    }

    console.log('🔔 Starting admin notification process for new listing...');
    console.log('📋 Notification trigger conditions met:', {
      hasListing: !!listing,
      status: listing.status,
      listingId: listing.id
    });
    
    try {
      console.log('👤 Fetching user profile for notification...');
      // Get user profile data for the notification
      const { data: userProfile, error: profileError } = await import('@/integrations/supabase/client').then(({ supabase }) =>
        supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single()
      );

      if (profileError) {
        console.error('❌ Failed to fetch user profile:', profileError);
        throw profileError;
      }

      console.log('✅ User profile fetched:', {
        fullName: userProfile?.full_name,
        email: userProfile?.email
      });

      if (userProfile) {
        console.log('📤 Calling admin notification service...');
        const notificationResult = await adminNotificationService.notifyAdminsOfNewListing(
          {
            id: listing.id,
            title: listing.title,
            agency: listing.agency,
            value: listing.value,
            phase: listing.phase,
            category: listing.category,
            description: listing.description
          },
          {
            full_name: userProfile.full_name || 'Unknown User',
            email: userProfile.email
          }
        );
        console.log('✅ Admin notification service result:', notificationResult);
      } else {
        console.warn('⚠️ No user profile found for notification');
      }
    } catch (notificationError) {
      // Log notification error but don't fail the whole operation
      console.error('❌ Admin notification process failed:', notificationError);
      console.error('❌ Notification error details:', JSON.stringify(notificationError, null, 2));
    }
  };

  return {
    sendNewListingNotification
  };
};
