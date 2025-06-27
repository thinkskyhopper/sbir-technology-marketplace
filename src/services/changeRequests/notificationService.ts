
import { supabase } from '@/integrations/supabase/client';

export const sendChangeRequestNotification = async (
  changeRequest: any,
  submitterName: string,
  submitterEmail: string
) => {
  try {
    // Fetch the listing information to include in the notification
    let listingInfo = null;
    if (changeRequest.listing_id) {
      const { data: listing } = await supabase
        .from('sbir_listings')
        .select('title, agency')
        .eq('id', changeRequest.listing_id)
        .single();
      
      if (listing) {
        listingInfo = listing;
      }
    }

    // Use preserved listing info if the listing has been deleted
    if (!listingInfo && (changeRequest.listing_title || changeRequest.listing_agency)) {
      listingInfo = {
        title: changeRequest.listing_title,
        agency: changeRequest.listing_agency
      };
    }

    // Prepare the change request data with listing information
    const changeRequestWithListing = {
      ...changeRequest,
      sbir_listings: listingInfo
    };

    const { error: notificationError } = await supabase.functions.invoke('send-change-request-notification', {
      body: {
        changeRequest: changeRequestWithListing,
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
