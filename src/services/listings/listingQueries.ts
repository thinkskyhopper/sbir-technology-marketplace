
import { supabase } from '@/integrations/supabase/client';
import type { SBIRListing } from '@/types/listings';
import type { PublicSBIRListing } from '@/types/publicListing';
import { PUBLIC_LISTING_COLUMNS } from '@/types/publicListing';

export const listingQueries = {
  async fetchListings(isAdmin: boolean, userId?: string): Promise<SBIRListing[]> {
    console.log('🔄 Fetching listings from Supabase...', { isAdmin, userId });
    
    if (isAdmin) {
      return this.fetchAdminListings(userId);
    } else {
      return this.fetchPublicListings(userId);
    }
  },

  async fetchPublicListings(userId?: string): Promise<PublicSBIRListing[]> {
    console.log('🔄 Fetching public listings (secure mode)...', { userId });
    
    try {
      let query = supabase
        .from('sbir_listings')
        .select(`
          ${PUBLIC_LISTING_COLUMNS},
          profiles!fk_sbir_listings_user_id(
            full_name,
            email
          )
        `)
        .in('status', ['Active', 'Sold'])
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('❌ Public query error:', error);
        return this.handlePublicFallbackQuery();
      }

      const formattedListings = data?.map(listing => ({
        ...listing,
        value: listing.value / 100, // Convert cents to dollars
        profiles: listing.profiles && typeof listing.profiles === 'object' && 'full_name' in listing.profiles 
          ? listing.profiles 
          : null
      })) || [];

      console.log('✅ Public listings formatted:', formattedListings.length);
      return formattedListings;
    } catch (error) {
      console.error('💥 Fatal error in fetchPublicListings:', error);
      return this.handlePublicFallbackQuery();
    }
  },

  async fetchAdminListings(userId?: string): Promise<SBIRListing[]> {
    console.log('🔄 Fetching admin listings (full access)...', { userId });
    
    try {
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

      const { data, error } = await query;

      if (error) {
        console.error('❌ Admin query error:', error);
        return this.handleAdminFallbackQuery();
      }

      const formattedListings = data?.map(listing => {
        console.log('📊 Processing admin listing:', {
          id: listing.id,
          status: listing.status,
          rawValueFromDB: listing.value,
          convertedValue: listing.value / 100,
          hasAdminData: !!(listing.agency_tracking_number || listing.contract)
        });

        return {
          ...listing,
          value: listing.value / 100, // Convert cents to dollars
          profiles: listing.profiles && typeof listing.profiles === 'object' && 'full_name' in listing.profiles 
            ? listing.profiles 
            : null
        };
      }) || [];

      console.log('✅ Admin listings formatted:', formattedListings.length);
      return formattedListings;
    } catch (error) {
      console.error('💥 Fatal error in fetchAdminListings:', error);
      return this.handleAdminFallbackQuery();
    }
  },

  async handlePublicFallbackQuery(): Promise<PublicSBIRListing[]> {
    console.log('🔄 Falling back to basic public listing fetch...');
    
    try {
      const fallbackQuery = supabase
        .from('sbir_listings')
        .select(PUBLIC_LISTING_COLUMNS)
        .in('status', ['Active', 'Sold'])
        .order('created_at', { ascending: false });

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      
      if (fallbackError) {
        console.error('❌ Public fallback query error:', fallbackError);
        throw fallbackError;
      }

      const formattedListings = fallbackData?.map(listing => ({
        ...listing,
        value: listing.value / 100, // Convert cents to dollars
        profiles: null // Explicitly set to null since no profile data is available
      })) || [];

      console.log('✅ Public listings fetched (fallback mode):', formattedListings.length);
      return formattedListings;
    } catch (error) {
      console.error('💥 Public fallback query failed:', error);
      return [];
    }
  },

  async handleAdminFallbackQuery(): Promise<SBIRListing[]> {
    console.log('🔄 Falling back to basic admin listing fetch...');
    
    try {
      const fallbackQuery = supabase
        .from('sbir_listings')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      
      if (fallbackError) {
        console.error('❌ Admin fallback query error:', fallbackError);
        throw fallbackError;
      }

      const formattedListings = fallbackData?.map(listing => ({
        ...listing,
        value: listing.value / 100, // Convert cents to dollars
        profiles: null // Explicitly set to null since no profile data is available
      })) || [];

      console.log('✅ Admin listings fetched (fallback mode):', formattedListings.length);
      return formattedListings as SBIRListing[];
    } catch (error) {
      console.error('💥 Admin fallback query failed:', error);
      return [];
    }
  },

  // Legacy method for backward compatibility
  async handleFallbackQuery(isAdmin: boolean, userId?: string): Promise<SBIRListing[]> {
    if (isAdmin) {
      return this.handleAdminFallbackQuery();
    } else {
      return this.handlePublicFallbackQuery() as Promise<SBIRListing[]>;
    }
  }
};
