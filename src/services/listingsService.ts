
import { supabase } from '@/integrations/supabase/client';
import type { SBIRListing, CreateListingData, UpdateListingData } from '@/types/listings';

export const listingsService = {
  async fetchListings(isAdmin: boolean, userId?: string): Promise<SBIRListing[]> {
    let query = supabase
      .from('sbir_listings')
      .select('*')
      .order('created_at', { ascending: false });

    // If not admin, only show active listings and user's own listings
    if (!isAdmin) {
      if (userId) {
        query = query.or(`status.eq.Active,user_id.eq.${userId}`);
      } else {
        query = query.eq('status', 'Active');
      }
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Convert value from cents to dollars and format dates
    const formattedListings = data?.map(listing => ({
      ...listing,
      value: listing.value / 100, // Convert cents to dollars
      deadline: new Date(listing.deadline).toISOString().split('T')[0]
    })) || [];

    return formattedListings;
  },

  async createListing(listingData: CreateListingData, userId: string): Promise<any> {
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

    if (error) throw error;
    return data;
  },

  async updateListing(listingId: string, listingData: UpdateListingData): Promise<void> {
    const { error } = await supabase
      .from('sbir_listings')
      .update({
        ...listingData,
        value: Math.round(listingData.value * 100), // Convert dollars to cents
      })
      .eq('id', listingId);

    if (error) throw error;
  },

  async approveListing(listingId: string, adminId: string): Promise<void> {
    const { error } = await supabase
      .from('sbir_listings')
      .update({ 
        status: 'Active',
        approved_at: new Date().toISOString(),
        approved_by: adminId
      })
      .eq('id', listingId);

    if (error) throw error;
  },

  async rejectListing(listingId: string): Promise<void> {
    const { error } = await supabase
      .from('sbir_listings')
      .update({ status: 'Rejected' })
      .eq('id', listingId);

    if (error) throw error;
  }
};
