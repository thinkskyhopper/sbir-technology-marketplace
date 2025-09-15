
import { supabase } from '@/integrations/supabase/client';
import type { CreateListingData, UpdateListingData, SBIRListing } from '@/types/listings';
import { listingQueries } from './listingQueries';

export const basicOperations = {
  async fetchListings(isAdmin: boolean, userId?: string): Promise<SBIRListing[]> {
    // Use the secure column-level query system
    return listingQueries.fetchListings(isAdmin, userId);
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
