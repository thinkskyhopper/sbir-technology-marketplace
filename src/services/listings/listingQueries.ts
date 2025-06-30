
import { supabase } from '@/integrations/supabase/client';
import type { SBIRListing } from '@/types/listings';

export const listingQueries = {
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
      return this.handleFallbackQuery(isAdmin, userId);
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

  async handleFallbackQuery(isAdmin: boolean, userId?: string): Promise<SBIRListing[]> {
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
};
