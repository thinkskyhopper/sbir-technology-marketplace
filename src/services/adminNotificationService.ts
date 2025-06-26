
import { supabase } from '@/integrations/supabase/client';

interface ListingNotificationData {
  id: string;
  title: string;
  agency: string;
  value: number;
  phase: string;
  category: string;
  description: string;
}

interface UserData {
  full_name: string;
  email: string;
}

export const adminNotificationService = {
  async notifyAdminsOfNewListing(listing: ListingNotificationData, userData: UserData) {
    try {
      console.log('🔔 Starting admin notification process for listing:', listing.id);
      console.log('📋 Listing data:', {
        title: listing.title,
        agency: listing.agency,
        submitter: userData.email
      });
      
      console.log('📤 Invoking send-admin-notification edge function...');
      const { data, error } = await supabase.functions.invoke('send-admin-notification', {
        body: {
          listing,
          submitterName: userData.full_name || 'Unknown User',
          submitterEmail: userData.email
        }
      });

      if (error) {
        console.error('❌ Supabase function invoke error:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      console.log('✅ Admin notification edge function response:', data);
      
      // Check if the response indicates success
      if (data && data.success) {
        console.log(`📧 Successfully sent notifications to ${data.emailsSent} admins`);
        return data;
      } else {
        console.warn('⚠️ Edge function returned but with potential issues:', data);
        return data;
      }
    } catch (error) {
      console.error('❌ Complete admin notification failure:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error; // Re-throw the error so it can be handled upstream
    }
  }
};
