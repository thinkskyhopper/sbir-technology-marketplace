
import { useAuth } from '@/contexts/AuthContext';
import { adminNotificationService } from '@/services/adminNotificationService';
import { supabase } from '@/integrations/supabase/client';
import type { SBIRListing } from '@/types/listings';

export const useAdminNotification = () => {
  const { user } = useAuth();

  const sendNewListingNotification = async (listing: SBIRListing) => {
    if (!user) {
      console.log('ℹ️ Admin notification skipped: No user authenticated');
      return;
    }

    // Only send notifications for Pending listings
    if (listing.status !== 'Pending') {
      console.log('ℹ️ Admin notification skipped:', {
        status: listing.status,
        reason: 'Notifications only sent for Pending listings'
      });
      return;
    }

    console.log('🔔 Starting admin notification process for new listing...', {
      listingId: listing.id,
      title: listing.title,
      status: listing.status
    });
    
    try {
      console.log('👤 Fetching user profile for notification...');
      
      // Get user profile data for the notification
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('❌ Failed to fetch user profile:', profileError);
        throw new Error(`Failed to fetch user profile: ${profileError.message}`);
      }

      if (!userProfile) {
        console.error('❌ No user profile found');
        throw new Error('User profile not found');
      }

      console.log('✅ User profile fetched successfully:', {
        fullName: userProfile.full_name,
        email: userProfile.email
      });

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
      
      console.log('✅ Admin notification sent successfully:', notificationResult);
      return notificationResult;
    } catch (notificationError) {
      // Log notification error but don't fail the whole operation
      console.error('❌ Admin notification process failed:', notificationError);
      
      // Create a more detailed error object for logging
      const errorDetails = {
        message: notificationError instanceof Error ? notificationError.message : 'Unknown error',
        stack: notificationError instanceof Error ? notificationError.stack : undefined,
        name: notificationError instanceof Error ? notificationError.name : 'Unknown',
        userId: user?.id,
        listingId: listing?.id
      };
      
      console.error('❌ Notification error details:', errorDetails);
      throw notificationError; // Re-throw so we can see the error in the console
    }
  };

  return {
    sendNewListingNotification
  };
};
