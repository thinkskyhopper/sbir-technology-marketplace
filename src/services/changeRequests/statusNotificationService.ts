
import { supabase } from '@/integrations/supabase/client';

export const sendChangeRequestStatusNotification = async (
  changeRequest: any,
  userEmail: string,
  userName: string
) => {
  try {
    console.log('📧 Sending status notification to user...', userEmail);

    const { error: notificationError } = await supabase.functions.invoke('send-change-request-status-notification', {
      body: {
        changeRequest: {
          id: changeRequest.id,
          status: changeRequest.status,
          request_type: changeRequest.request_type,
          admin_notes_for_user: changeRequest.admin_notes_for_user,
          listing_title: changeRequest.listing_title,
          listing_agency: changeRequest.listing_agency,
          created_at: changeRequest.created_at,
          processed_at: changeRequest.processed_at
        },
        userEmail,
        userName
      }
    });

    if (notificationError) {
      console.warn('⚠️ Status notification failed (status still updated):', notificationError);
    } else {
      console.log('✅ Status notification sent successfully');
    }
  } catch (notificationError) {
    console.warn('⚠️ Status notification failed (status still updated):', notificationError);
  }
};
