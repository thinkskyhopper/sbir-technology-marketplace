
import { supabase } from '@/integrations/supabase/client';
import type { ListingChangeRequest } from '@/types/changeRequests';

export const handleApprovedDeletion = async (changeRequest: ListingChangeRequest) => {
  console.log('🗑️ Deleting listing for approved deletion request...', changeRequest.listing_id);
  
  const { error: deleteError } = await supabase
    .from('sbir_listings')
    .delete()
    .eq('id', changeRequest.listing_id);

  if (deleteError) {
    console.error('❌ Error deleting listing:', deleteError);
    throw new Error(`Failed to delete listing: ${deleteError.message}`);
  }

  console.log('✅ Successfully deleted listing for approved deletion request');
};

export const handleApprovedChanges = async (changeRequest: ListingChangeRequest) => {
  if (!changeRequest.requested_changes) {
    console.warn('⚠️ No requested changes found, skipping listing update');
    return;
  }

  console.log('🔄 Applying approved changes to listing...', changeRequest.listing_id);
  
  // Ensure requested_changes is an object before spreading
  const requestedChanges = changeRequest.requested_changes;
  if (typeof requestedChanges === 'object' && requestedChanges !== null && !Array.isArray(requestedChanges)) {
    const updateData = { ...requestedChanges };
    
    // Convert value to cents if present
    if (updateData.value && typeof updateData.value === 'number') {
      updateData.value = Math.round(updateData.value * 100); // Convert dollars to cents
    }

    const { error: listingUpdateError } = await supabase
      .from('sbir_listings')
      .update(updateData)
      .eq('id', changeRequest.listing_id);

    if (listingUpdateError) {
      console.error('❌ Error updating listing with approved changes:', listingUpdateError);
      throw new Error(`Failed to apply changes to listing: ${listingUpdateError.message}`);
    }

    console.log('✅ Successfully applied approved changes to listing');
  } else {
    console.warn('⚠️ Invalid requested_changes format, skipping listing update');
  }
};
