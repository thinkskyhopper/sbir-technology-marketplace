
import { supabase } from '@/integrations/supabase/client';
import type { SBIRListing, CreateListingData, UpdateListingData } from '@/types/listings';

export const listingsService = {
  async fetchListings(isAdmin: boolean, userId?: string): Promise<SBIRListing[]> {
    console.log('🔄 Fetching listings from Supabase...', { isAdmin, userId });
    
    let query = supabase
      .from('sbir_listings')
      .select(`
        *,
        profiles!fk_sbir_listings_user_id(
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    // If not admin, only show active listings and user's own listings (excluding hidden)
    if (!isAdmin) {
      if (userId) {
        query = query.or(`status.eq.Active,user_id.eq.${userId}`);
      } else {
        query = query.eq('status', 'Active');
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase query error:', error);
      // Fallback: fetch listings without profile data if join fails
      console.log('🔄 Falling back to basic listing fetch...');
      const fallbackQuery = supabase
        .from('sbir_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        if (userId) {
          fallbackQuery.or(`status.eq.Active,user_id.eq.${userId}`);
        } else {
          fallbackQuery.eq('status', 'Active');
        }
      }

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      
      if (fallbackError) {
        throw fallbackError;
      }

      // Return listings without profile data - properly structure the data
      const formattedListings = fallbackData?.map(listing => ({
        ...listing,
        value: listing.value / 100,
        deadline: new Date(listing.deadline).toISOString().split('T')[0],
        profiles: null // Explicitly set to null since no profile data is available
      })) || [];

      console.log('✅ Listings fetched (fallback mode):', formattedListings.length);
      return formattedListings as SBIRListing[];
    }

    // Convert value from cents to dollars and format dates
    const formattedListings = data?.map(listing => ({
      ...listing,
      value: listing.value / 100, // Convert cents to dollars
      deadline: new Date(listing.deadline).toISOString().split('T')[0],
      // Ensure profiles is properly typed - it should either be the profile object or null
      profiles: listing.profiles && typeof listing.profiles === 'object' && 'full_name' in listing.profiles 
        ? listing.profiles 
        : null
    })) || [];

    console.log('✅ Listings formatted:', formattedListings.length);
    return formattedListings;
  },

  async createListing(listingData: CreateListingData, userId: string): Promise<any> {
    console.log('📝 Creating listing...', { title: listingData.title, userId });
    
    const { data, error } = await supabase
      .from('sbir_listings')
      .insert({
        ...listingData,
        value: Math.round(listingData.value * 100), // Convert dollars to cents
        user_id: userId,
        status: listingData.status || 'Pending' // Default to Pending for user submissions
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Create listing error:', error);
      throw error;
    }
    
    console.log('✅ Listing created successfully:', data.id);
    return data;
  },

  async updateListing(listingId: string, listingData: UpdateListingData): Promise<void> {
    console.log('📝 Updating listing...', { listingId, status: listingData.status });
    
    const { error } = await supabase
      .from('sbir_listings')
      .update({
        ...listingData,
        value: Math.round(listingData.value * 100), // Convert dollars to cents
      })
      .eq('id', listingId);

    if (error) {
      console.error('❌ Update listing error:', error);
      throw error;
    }
    
    console.log('✅ Listing updated successfully');
  },

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
