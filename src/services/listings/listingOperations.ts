
import { supabase } from '@/integrations/supabase/client';
import type { CreateListingData, UpdateListingData } from '@/types/listings';

export const listingOperations = {
  async createListing(listingData: CreateListingData, userId: string): Promise<any> {
    console.log('📝 Creating listing...', { 
      title: listingData.title, 
      userId,
      inputValue: listingData.value,
      valueInCents: Math.round(listingData.value * 100)
    });
    
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
  }
};
