
import { supabase } from '@/integrations/supabase/client';
import type { SBIRListing } from '@/types/listings';

export const listingQueries = {
  async fetchListings(isAdmin: boolean, userId?: string): Promise<SBIRListing[]> {
    console.log('🔄 Fetching listings from Supabase...', { isAdmin, userId });
    
    try {
      let query = supabase
        .from('sbir_listings')
        .select(`
          *,
          date_sold,
          technology_summary,
          profiles!fk_sbir_listings_user_id(
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // If admin, show all listings
      if (isAdmin) {
        // Admin sees everything - no additional filtering needed
      } else {
        // For non-admin users (including non-authenticated), show only Active and Sold listings
        // This applies to both their own listings and others' listings
        query = query.in('status', ['Active', 'Sold']);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Supabase query error:', error);
        // Try fallback query without profiles
        return this.handleFallbackQuery(isAdmin, userId);
      }

      // Convert value from cents to dollars and format dates
      const formattedListings = data?.map(listing => {
        console.log('📊 Processing listing:', {
          id: listing.id,
          status: listing.status,
          rawValueFromDB: listing.value,
          convertedValue: listing.value / 100,
          date_sold: listing.date_sold,
          date_sold_raw: listing.date_sold
        });

        return {
          ...listing,
          value: listing.value / 100, // Convert cents to dollars
          // Ensure profiles is properly typed
          profiles: listing.profiles && typeof listing.profiles === 'object' && 'full_name' in listing.profiles 
            ? listing.profiles 
            : null
        };
      }) || [];

      console.log('✅ Listings formatted:', formattedListings.length);
      return formattedListings;
    } catch (error) {
      console.error('💥 Fatal error in fetchListings:', error);
      return this.handleFallbackQuery(isAdmin, userId);
    }
  },

  async handleFallbackQuery(isAdmin: boolean, userId?: string): Promise<SBIRListing[]> {
    console.log('🔄 Falling back to basic listing fetch...');
    
    try {
      const fallbackQuery = supabase
        .from('sbir_listings')
        .select('*, date_sold, technology_summary')
        .order('created_at', { ascending: false });

      // Apply the same filtering logic as the main query
      if (isAdmin) {
        // Admin sees everything - no additional filtering needed
      } else {
        // For non-admin users, show only Active and Sold listings
        fallbackQuery.in('status', ['Active', 'Sold']);
      }

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      
      if (fallbackError) {
        console.error('❌ Fallback query error:', fallbackError);
        throw fallbackError;
      }

      // Return listings without profile data
      const formattedListings = fallbackData?.map(listing => ({
        ...listing,
        value: listing.value / 100, // Convert cents to dollars
        profiles: null // Explicitly set to null since no profile data is available
      })) || [];

      console.log('✅ Listings fetched (fallback mode):', {
        count: formattedListings.length,
        sampleValues: formattedListings.slice(0, 3).map(l => ({
          id: l.id,
          title: l.title,
          valueInDollars: l.value
        }))
      });
      return formattedListings as SBIRListing[];
    } catch (error) {
      console.error('💥 Fallback query failed:', error);
      return [];
    }
  }
};
