
import { supabase } from '@/integrations/supabase/client';

export const approvalOperations = {
  async approveListing(listingId: string, adminId: string, userNotes?: string, internalNotes?: string): Promise<void> {
    console.log('✅ Approving listing...', { listingId, adminId });
    
    // First get the listing details for audit log
    const { data: listing, error: fetchError } = await supabase
      .from('sbir_listings')
      .select('title, agency')
      .eq('id', listingId)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching listing for audit:', fetchError);
      throw fetchError;
    }

    // Update the listing status
    const { error } = await supabase
      .from('sbir_listings')
      .update({ 
        status: 'Active',
        approved_at: new Date().toISOString(),
        approved_by: adminId
      })
      .eq('id', listingId);

    if (error) {
      console.error('❌ Approve listing error:', error);
      throw error;
    }

    // Create audit log entry
    const { error: auditError } = await supabase
      .from('admin_audit_logs')
      .insert({
        listing_id: listingId,
        listing_title: listing.title,
        listing_agency: listing.agency,
        admin_id: adminId,
        action_type: 'approval',
        user_notes: userNotes || null,
        internal_notes: internalNotes || null,
        user_notified: false // Will be updated when notification is sent
      });

    if (auditError) {
      console.error('❌ Error creating audit log:', auditError);
      // Don't throw here as the main operation succeeded
    }
    
    console.log('✅ Listing approved successfully with audit log');
  },

  async rejectListing(listingId: string, adminId: string, userNotes?: string, internalNotes?: string): Promise<void> {
    console.log('❌ Rejecting listing...', { listingId, adminId });
    
    // First get the listing details for audit log
    const { data: listing, error: fetchError } = await supabase
      .from('sbir_listings')
      .select('title, agency')
      .eq('id', listingId)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching listing for audit:', fetchError);
      throw fetchError;
    }

    // Update the listing status
    const { error } = await supabase
      .from('sbir_listings')
      .update({ status: 'Rejected' })
      .eq('id', listingId);

    if (error) {
      console.error('❌ Reject listing error:', error);
      throw error;
    }

    // Create audit log entry
    const { error: auditError } = await supabase
      .from('admin_audit_logs')
      .insert({
        listing_id: listingId,
        listing_title: listing.title,
        listing_agency: listing.agency,
        admin_id: adminId,
        action_type: 'denial',
        user_notes: userNotes || null,
        internal_notes: internalNotes || null,
        user_notified: false
      });

    if (auditError) {
      console.error('❌ Error creating audit log:', auditError);
      // Don't throw here as the main operation succeeded
    }
    
    console.log('✅ Listing rejected successfully with audit log');
  }
};
