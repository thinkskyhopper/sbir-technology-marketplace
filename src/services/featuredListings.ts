
import { supabase } from '@/integrations/supabase/client';
import type { SBIRListing } from '@/types/listings';

export interface FeaturedListing {
  id: string;
  listing_id: string;
  display_order: number;
  created_at: string;
  created_by: string;
  sbir_listings?: SBIRListing;
}

export const featuredListingsService = {
  async getFeaturedListings(): Promise<SBIRListing[]> {
    console.log('🔄 Fetching featured listings...');
    
    const { data: featuredData, error: featuredError } = await supabase
      .from('featured_listings')
      .select(`
        *,
        sbir_listings!inner(
          *,
          profiles!fk_sbir_listings_user_id(
            full_name,
            email
          )
        )
      `)
      .eq('sbir_listings.status', 'Active')
      .order('display_order', { ascending: true });

    if (featuredError) {
      console.error('❌ Error fetching featured listings:', featuredError);
      throw featuredError;
    }

    // Extract the listing data and format it
    const featuredListings = featuredData?.map(item => ({
      ...item.sbir_listings,
      value: item.sbir_listings.value / 100, // Convert cents to dollars
      deadline: new Date(item.sbir_listings.deadline).toISOString().split('T')[0],
    })) || [];

    console.log('✅ Featured listings fetched:', featuredListings.length);
    return featuredListings;
  },

  async getHomepageListings(): Promise<SBIRListing[]> {
    console.log('🔄 Getting homepage listings (featured + newest)...');
    
    // Get featured listings
    const featuredListings = await this.getFeaturedListings();
    
    // If we have less than 6 featured listings, fill with newest
    if (featuredListings.length < 6) {
      const neededCount = 6 - featuredListings.length;
      
      // Get featured listing IDs to exclude them from newest query
      const featuredIds = featuredListings.map(listing => listing.id);
      
      const { data: newestData, error: newestError } = await supabase
        .from('sbir_listings')
        .select(`
          *,
          profiles!fk_sbir_listings_user_id(
            full_name,
            email
          )
        `)
        .eq('status', 'Active')
        .not('id', 'in', `(${featuredIds.join(',')})`)
        .order('submitted_at', { ascending: false })
        .limit(neededCount);

      if (newestError) {
        console.error('❌ Error fetching newest listings:', newestError);
        throw newestError;
      }

      const newestListings = newestData?.map(listing => ({
        ...listing,
        value: listing.value / 100, // Convert cents to dollars
        deadline: new Date(listing.deadline).toISOString().split('T')[0],
      })) || [];

      const combinedListings = [...featuredListings, ...newestListings];
      console.log('✅ Homepage listings combined:', combinedListings.length);
      return combinedListings;
    }

    console.log('✅ Using only featured listings:', featuredListings.length);
    return featuredListings;
  },

  async addFeaturedListing(listingId: string, displayOrder: number): Promise<void> {
    console.log('🔄 Adding featured listing...', { listingId, displayOrder });
    
    const { error } = await supabase
      .from('featured_listings')
      .insert({
        listing_id: listingId,
        display_order: displayOrder,
        created_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      console.error('❌ Error adding featured listing:', error);
      throw error;
    }
    
    console.log('✅ Featured listing added successfully');
  },

  async removeFeaturedListing(listingId: string): Promise<void> {
    console.log('🔄 Removing featured listing...', { listingId });
    
    const { error } = await supabase
      .from('featured_listings')
      .delete()
      .eq('listing_id', listingId);

    if (error) {
      console.error('❌ Error removing featured listing:', error);
      throw error;
    }
    
    console.log('✅ Featured listing removed successfully');
  },

  async updateDisplayOrder(listingId: string, displayOrder: number): Promise<void> {
    console.log('🔄 Updating featured listing display order...', { listingId, displayOrder });
    
    const { error } = await supabase
      .from('featured_listings')
      .update({ display_order: displayOrder })
      .eq('listing_id', listingId);

    if (error) {
      console.error('❌ Error updating display order:', error);
      throw error;
    }
    
    console.log('✅ Display order updated successfully');
  }
};
