
import { supabase } from '@/integrations/supabase/client';

export const adminOperations = {
  async approveListing(listingId: string, adminId: string): Promise<void> {
    console.log('✅ Approving listing...', { listingId, adminId });
    
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
    
    console.log('✅ Listing approved successfully');
  },

  async rejectListing(listingId: string): Promise<void> {
    console.log('❌ Rejecting listing...', { listingId });
    
    const { error } = await supabase
      .from('sbir_listings')
      .update({ status: 'Rejected' })
      .eq('id', listingId);

    if (error) {
      console.error('❌ Reject listing error:', error);
      throw error;
    }
    
    console.log('✅ Listing rejected successfully');
  },

  async hideListing(listingId: string): Promise<void> {
    console.log('🙈 Hiding listing...', { listingId });
    
    const { error } = await supabase
      .from('sbir_listings')
      .update({ status: 'Hidden' })
      .eq('id', listingId);

    if (error) {
      console.error('❌ Hide listing error:', error);
      throw error;
    }
    
    console.log('✅ Listing hidden successfully');
  },

  async deleteListing(listingId: string): Promise<void> {
    console.log('🗑️ Attempting to delete listing...', { listingId });
    
    // First, let's check if the listing exists
    const { data: existingListing, error: fetchError } = await supabase
      .from('sbir_listings')
      .select('id, title, status')
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
