
import { supabase } from '@/integrations/supabase/client';

export const adminOperations = {
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
  },

  async hideListing(listingId: string, adminId: string, userNotes?: string, internalNotes?: string): Promise<void> {
    console.log('🙈 Hiding listing...', { listingId, adminId });
    
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
      .update({ status: 'Hidden' })
      .eq('id', listingId);

    if (error) {
      console.error('❌ Hide listing error:', error);
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
        action_type: 'edit',
        user_notes: userNotes || null,
        internal_notes: internalNotes || null,
        user_notified: false,
        changes_made: { status: 'Hidden' }
      });

    if (auditError) {
      console.error('❌ Error creating audit log:', auditError);
      // Don't throw here as the main operation succeeded
    }
    
    console.log('✅ Listing hidden successfully with audit log');
  },

  async deleteListing(listingId: string, adminId: string, userNotes?: string, internalNotes?: string): Promise<void> {
    console.log('🗑️ Attempting to delete listing...', { listingId, adminId });
    
    // First, let's check if the listing exists and get its details for audit
    const { data: existingListing, error: fetchError } = await supabase
      .from('sbir_listings')
      .select('id, title, agency, status')
      .eq('id', listingId)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching listing before delete:', fetchError);
      throw new Error(`Failed to find listing: ${fetchError.message}`);
    }

    if (!existingListing) {
      console.error('❌ Listing not found:', listingId);
      throw new Error('Listing not found');
    }

    console.log('📋 Found listing to delete:', existingListing);

    // Create audit log entry before deletion (since we'll lose the listing reference)
    const { error: auditError } = await supabase
      .from('admin_audit_logs')
      .insert({
        listing_id: listingId,
        listing_title: existingListing.title,
        listing_agency: existingListing.agency,
        admin_id: adminId,
        action_type: 'deletion',
        user_notes: userNotes || null,
        internal_notes: internalNotes || null,
        user_notified: false
      });

    if (auditError) {
      console.error('❌ Error creating audit log before deletion:', auditError);
      // Continue with deletion even if audit log fails
    }

    // Now attempt to delete the listing
    const { error: deleteError, data } = await supabase
      .from('sbir_listings')
      .delete()
      .eq('id', listingId)
      .select(); // This will return the deleted rows for confirmation

    if (deleteError) {
      console.error('❌ Delete listing error:', deleteError);
      
      // Check if it's a permission error
      if (deleteError.code === 'PGRST116' || deleteError.message.includes('policy')) {
        throw new Error('You do not have permission to delete this listing. Only admins can delete listings.');
      }
      
      throw new Error(`Failed to delete listing: ${deleteError.message}`);
    }
    
    console.log('✅ Listing deleted successfully. Deleted rows:', data);
    
    if (!data || data.length === 0) {
      console.warn('⚠️ Delete operation completed but no rows were affected');
      throw new Error('Delete operation completed but no rows were affected. This may be due to insufficient permissions or the listing may have already been deleted.');
    }
  }
};
