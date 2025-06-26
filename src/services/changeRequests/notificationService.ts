
import { supabase } from '@/integrations/supabase/client';

export const sendChangeRequestNotification = async (
  changeRequest: any,
  submitterName: string,
  submitterEmail: string
) => {
  try {
    const { error: notificationError } = await supabase.functions.invoke('send-change-request-notification', {
      body: {
        changeRequest,
        submitterName,
        submitterEmail
      }
    });

    if (notificationError) {
      console.warn('⚠️ Change request notification failed (request still created):', notificationError);
    } else {
      console.log('✅ Change request notification sent successfully');
    }
  } catch (notificationError) {
    console.warn('⚠️ Change request notification failed (request still created):', notificationError);
  }
};
