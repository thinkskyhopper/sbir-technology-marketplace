
import { supabase } from '@/integrations/supabase/client';

export const editOperations = {
  async updateListingWithAudit(
    listingId: string, 
    updateData: any, 
    adminId: string, 
    internalNotes?: string
  ): Promise<void> {
    console.log('✏️ Updating listing with audit...', { listingId, adminId });
    
    // First get the current listing data to track changes
    const { data: currentListing, error: fetchError } = await supabase
      .from('sbir_listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching current listing for audit:', fetchError);
      throw fetchError;
    }

    // Update the listing
    const { error: updateError } = await supabase
      .from('sbir_listings')
      .update(updateData)
      .eq('id', listingId);

    if (updateError) {
      console.error('❌ Update listing error:', updateError);
      throw updateError;
    }

    // Calculate changes made
    const changesMade: Record<string, { from: any; to: any }> = {};
    
    Object.keys(updateData).forEach(key => {
      const oldValue = currentListing[key];
      const newValue = updateData[key];
      
      // Only track actual changes
      if (oldValue !== newValue) {
        changesMade[key] = {
          from: oldValue,
          to: newValue
        };
      }
    });

    // Only create audit log if there were actual changes
    if (Object.keys(changesMade).length > 0) {
      const { error: auditError } = await supabase
        .from('admin_audit_logs')
        .insert({
          listing_id: listingId,
          listing_title: currentListing.title,
          listing_agency: currentListing.agency,
          admin_id: adminId,
          action_type: 'edit',
          internal_notes: internalNotes || null,
          user_notes: null, // Admin edits don't typically have user-facing notes
          user_notified: false,
          changes_made: changesMade
        });

      if (auditError) {
        console.error('❌ Error creating audit log for edit:', auditError);
        // Don't throw here as the main operation succeeded
      } else {
        console.log('✅ Listing updated successfully with audit log:', changesMade);
      }
    } else {
      console.log('ℹ️ No changes detected, skipping audit log');
    }
  }
};
