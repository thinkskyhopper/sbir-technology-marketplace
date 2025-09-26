import { supabase } from '@/integrations/supabase/client';
import type { ListingStatus } from '@/types/listings';

export const statusOperations = {
  async changeListingStatus(
    listingId: string, 
    newStatus: ListingStatus, 
    adminId: string, 
    userNotes?: string, 
    internalNotes?: string
  ): Promise<void> {
    console.log('🔄 Changing listing status...', { listingId, newStatus, adminId });
    
    // First get the listing details for audit log
    const { data: listing, error: fetchError } = await supabase
      .from('sbir_listings')
      .select('title, agency, status')
      .eq('id', listingId)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching listing for audit:', fetchError);
      throw fetchError;
    }

    // Prepare update data
    const updateData: any = { status: newStatus };
    
    // Set approved_at and approved_by for Active status
    if (newStatus === 'Active') {
      updateData.approved_at = new Date().toISOString();
      updateData.approved_by = adminId;
    }

    // Update the listing status
    const { error } = await supabase
      .from('sbir_listings')
      .update(updateData)
      .eq('id', listingId);

    if (error) {
      console.error('❌ Change status error:', error);
      throw error;
    }

    // Determine action type for audit log
    let actionType: 'approval' | 'denial' | 'edit' | 'deletion';
    switch (newStatus) {
      case 'Active':
        actionType = 'approval';
        break;
      case 'Rejected':
        actionType = 'denial';
        break;
      default:
        actionType = 'edit';
    }

    // Create audit log entry
    const { error: auditError } = await supabase
      .from('admin_audit_logs')
      .insert({
        listing_id: listingId,
        listing_title: listing.title,
        listing_agency: listing.agency,
        admin_id: adminId,
        action_type: actionType,
        user_notes: userNotes || null,
        internal_notes: internalNotes || null,
        user_notified: false,
        changes_made: { 
          status: { 
            from: listing.status, 
            to: newStatus 
          } 
        }
      });

    if (auditError) {
      console.error('❌ Error creating audit log:', auditError);
      // Don't throw here as the main operation succeeded
    }
    
    console.log('✅ Listing status changed successfully with audit log');
  }
};