
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
    
    // Use secure RPC function to get featured listings without exposing admin user IDs
    const { data: featuredData, error: featuredError } = await supabase
      .rpc('get_public_featured_listings');

    if (featuredError) {
      console.error('❌ Error fetching featured listings:', featuredError);
      throw featuredError;
    }

    if (!featuredData || featuredData.length === 0) {
      console.log('✅ No featured listings found');
      return [];
    }

    // Get unique user IDs to fetch profile data
    const userIds = [...new Set(featuredData.map(item => item.user_id))];
    
    // Fetch profile data using public RPC function (works for unauthenticated users)
    const profilePromises = userIds.map(userId => 
      supabase.rpc('get_public_profile', { profile_user_id: userId })
    );

    const profileResults = await Promise.all(profilePromises);
    const profilesData = profileResults
      .filter(result => result.data && result.data.length > 0)
      .map(result => result.data![0]);

    // Create a map of user_id to profile for easy lookup
    const profileMap = (profilesData || []).reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {} as Record<string, any>);

    // Format the listings with profile data
    const featuredListings = featuredData.map(item => ({
      id: item.listing_id,
      title: item.title,
      description: item.description,
      phase: item.phase,
      agency: item.agency,
      value: item.value / 100, // Convert cents to dollars
      deadline: item.deadline,
      category: item.category,
      status: item.status,
      submitted_at: item.submitted_at,
      approved_at: item.approved_at,
      user_id: item.user_id,
      photo_url: item.photo_url,
      date_sold: item.date_sold,
      technology_summary: item.technology_summary,
      created_at: item.listing_created_at,
      updated_at: item.listing_updated_at,
      profiles: profileMap[item.user_id] || null
    }));

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
      
      const { data: publicListings, error: newestError } = await supabase
        .rpc('get_public_listings');

      if (newestError) {
        console.error('❌ Error fetching newest listings:', newestError);
        throw newestError;
      }

      // Filter out featured listings and get newest
      const newestListings = (publicListings || [])
        .filter(listing => !featuredIds.includes(listing.id))
        .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
        .slice(0, neededCount)
        .map(listing => ({
          ...listing,
          value: listing.value / 100, // Convert cents to dollars
        }));

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
