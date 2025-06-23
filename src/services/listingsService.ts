import { supabase } from '@/integrations/supabase/client';
import type { SBIRListing, CreateListingData, UpdateListingData } from '@/types/listings';

export const listingsService = {
  async fetchListings(isAdmin: boolean, userId?: string): Promise<SBIRListing[]> {
    console.log('🔄 Fetching listings from Supabase...', { isAdmin, userId });
    
    let query = supabase
      .from('sbir_listings')
      .select('*')
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
      throw error;
    }

    // Convert value from cents to dollars and format dates
    const formattedListings = data?.map(listing => ({
      ...listing,
      value: listing.value / 100, // Convert cents to dollars
      deadline: new Date(listing.deadline).toISOString().split('T')[0]
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
  }
};
