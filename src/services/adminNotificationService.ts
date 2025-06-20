
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
      console.log('🔔 Sending admin notification for new listing:', listing.id);
      
      const { data, error } = await supabase.functions.invoke('send-admin-notification', {
        body: {
          listing,
          submitterName: userData.full_name || 'Unknown User',
          submitterEmail: userData.email
        }
      });

      if (error) {
        console.error('❌ Error sending admin notification:', error);
        throw error;
      }

      console.log('✅ Admin notification sent successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to send admin notification:', error);
      // Don't throw the error as we don't want listing creation to fail if notification fails
      return null;
    }
  }
};
