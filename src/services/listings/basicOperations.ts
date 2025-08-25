
import { supabase } from '@/integrations/supabase/client';
import type { CreateListingData, UpdateListingData, SBIRListing } from '@/types/listings';

export const basicOperations = {
  async fetchListings(isAdmin: boolean, userId?: string): Promise<SBIRListing[]> {
    let query = supabase
      .from('sbir_listings')
      .select(`
        *,
        profiles!fk_sbir_listings_user_id (
          full_name,
          email
        )
      `);

    if (isAdmin) {
      // Admins can see all listings
      query = query.order('submitted_at', { ascending: false });
    } else if (userId) {
      // Regular users can see their own listings + active/sold listings
      query = query.or(`user_id.eq.${userId},status.in.(Active,Sold)`)
                   .order('submitted_at', { ascending: false });
    } else {
      // Anonymous users can only see active/sold listings
      query = query.in('status', ['Active', 'Sold'])
                   .order('submitted_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching listings:', error);
      throw error;
    }

    console.log('✅ Successfully fetched listings:', data?.length || 0);
    return data || [];
  },

  async createListing(listingData: CreateListingData, userId: string): Promise<SBIRListing> {
    console.log('🔄 Creating new listing...', { userId });
    
    const { data, error } = await supabase
      .from('sbir_listings')
      .insert({
        ...listingData,
        value: Math.round(listingData.value * 100), // Convert dollars to cents
        user_id: userId,
        submitted_at: new Date().toISOString()
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
    console.log('🔄 Updating listing...', { listingId });
    
    const { error } = await supabase
      .from('sbir_listings')
      .update({
        ...listingData,
        value: Math.round(listingData.value * 100), // Convert dollars to cents
        updated_at: new Date().toISOString()
      })
      .eq('id', listingId);

    if (error) {
      console.error('❌ Update listing error:', error);
      throw error;
    }

    console.log('✅ Listing updated successfully');
  }
};
