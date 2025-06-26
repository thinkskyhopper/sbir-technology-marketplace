
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
      return data;
    } catch (error) {
      console.error('❌ Complete admin notification failure:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      // Don't throw the error as we don't want listing creation to fail if notification fails
      return null;
    }
  }
};
