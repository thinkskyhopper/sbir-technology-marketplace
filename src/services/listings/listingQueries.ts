
import { supabase } from '@/integrations/supabase/client';
import type { SBIRListing } from '@/types/listings';
import type { PublicSBIRListing } from '@/types/publicListing';
import { PUBLIC_LISTING_COLUMNS } from '@/types/publicListing';
import { apiClient, vpnOptimizedClient } from '@/utils/apiClient';

export const listingQueries = {
  async fetchListings(isAdmin: boolean, userId?: string): Promise<SBIRListing[]> {
    console.log('🔄 Fetching listings from Supabase...', { isAdmin, userId });
    
    // Double-check admin status on the server to avoid RLS permission errors
    let confirmedAdmin = false;
    try {
      const isAdminServer = await apiClient.supabaseQuery(
        supabase.rpc('current_user_is_admin'),
        { retries: 2, timeout: 15000 }
      );
      if (isAdminServer === true) {
        confirmedAdmin = true;
      }
    } catch (e: any) {
      console.warn('⚠️ Admin RPC check failed, falling back to public listings:', e);
      if (e.isVpnRelated) {
        console.log('🔍 VPN-related error detected during admin check');
      }
    }

    if (isAdmin && confirmedAdmin) {
      return this.fetchAdminListings(userId);
    }

    // Default to public listings for non-admins or if admin cannot be confirmed
    return this.fetchPublicListings(userId);
  },

  async fetchPublicListings(userId?: string): Promise<PublicSBIRListing[]> {
    console.log('🔄 Fetching public listings (secure RPC mode)...', { userId });
    
    try {
      // Use the secure RPC function that only returns safe columns with VPN-optimized client
      const data = await vpnOptimizedClient.supabaseQuery(
        supabase.rpc('get_public_listings'),
        { timeout: 30000, retries: 5 }
      );

      // Now fetch public profile data separately for the listings we got (secure access only)
      const listingIds = (data || []).map(listing => listing.user_id).filter(Boolean);
      
      let profilesData: any[] = [];
      if (listingIds.length > 0) {
        // Use public profile function to get only safe profile data for public listings
        for (const userId of listingIds) {
          try {
            const publicProfile = await apiClient.supabaseQuery(
              supabase.rpc('get_public_profile', { profile_user_id: userId }),
              { timeout: 15000, retries: 3 }
            );
            
            if (publicProfile && publicProfile.length > 0) {
              const profile = publicProfile[0];
              profilesData.push({
                id: profile.id,
                full_name: profile.full_name,
                email: null // Don't expose email in public listings for privacy
              });
            }
          } catch (error: any) {
            console.warn('⚠️ Could not fetch public profile for user:', userId);
            if (error.isVpnRelated) {
              console.log('🔍 VPN-related error during profile fetch');
            }
          }
        }
      }

      const formattedListings = (data || []).map((listing: any) => {
        const profile = profilesData.find(p => p.id === listing.user_id);
        return {
          ...listing,
          value: (listing.value || 0) / 100, // Convert cents to dollars
          profiles: profile ? { full_name: profile.full_name, email: profile.email } : null
        };
      });

      console.log('✅ Public listings formatted (RPC mode):', formattedListings.length);
      return formattedListings;
    } catch (error: any) {
      console.error('💥 Fatal error in fetchPublicListings:', error);
      if (error.isVpnRelated) {
        console.log('🔍 VPN-related error detected in fetchPublicListings');
      }
      return this.handlePublicFallbackQuery();
    }
  },

  async fetchAdminListings(userId?: string): Promise<SBIRListing[]> {
    console.log('🔄 Fetching admin listings (full access)...', { userId });
    
    try {
      // Fetch listings with separate profile query to avoid FK embedding issues
      const listingsData = await vpnOptimizedClient.supabaseQuery(
        supabase.from('sbir_listings').select('*').order('created_at', { ascending: false }),
        { timeout: 30000, retries: 4 }
      );

      // Fetch profiles separately if we have listings
      let profilesData: any[] = [];
      if (listingsData && listingsData.length > 0) {
        const userIds = [...new Set(listingsData.map(listing => listing.user_id))];
        
        try {
          const profiles = await apiClient.supabaseQuery(
            supabase.from('profiles').select('id, full_name, email').in('id', userIds as string[]),
            { timeout: 20000, retries: 3 }
          );
          
          if (profiles) {
            profilesData = profiles;
          }
        } catch (error: any) {
          console.warn('⚠️ Could not fetch profiles for admin listings:', error);
          if (error.isVpnRelated) {
            console.log('🔍 VPN-related error during admin profile fetch');
          }
        }
      }

      const formattedListings = listingsData?.map(listing => {
        const profile = profilesData.find(p => p.id === listing.user_id);
        
        console.log('📊 Processing admin listing:', {
          id: listing.id,
          status: listing.status,
          rawValueFromDB: listing.value,
          convertedValue: listing.value / 100,
          hasAdminData: !!(listing.agency_tracking_number || listing.contract),
          hasProfile: !!profile
        });

        return {
          ...listing,
          value: listing.value / 100, // Convert cents to dollars
          profiles: profile ? { full_name: profile.full_name, email: profile.email } : null
        };
      }) || [];

      console.log('✅ Admin listings formatted:', formattedListings.length);
      return formattedListings;
    } catch (error: any) {
      console.error('💥 Fatal error in fetchAdminListings:', error);
      if (error.isVpnRelated) {
        console.log('🔍 VPN-related error detected in fetchAdminListings');
      }
      
      // If it's a permission error, fall back to public listings
      if (error.statusCode === 403 || error.originalError?.code === '42501') {
        console.log('🔄 Permission denied for admin query, falling back to public listings...');
        return this.fetchPublicListings(userId);
      }
      
      return this.handleAdminFallbackQuery();
    }
  },

  async handlePublicFallbackQuery(): Promise<PublicSBIRListing[]> {
    console.log('🔄 Public fallback - returning empty array since table access is restricted...');
    
    // Since public access to sbir_listings table is now revoked for security,
    // and the RPC failed, we return empty array rather than risk exposing sensitive data
    return [];
  },

  async handleAdminFallbackQuery(): Promise<SBIRListing[]> {
    console.log('🔄 Admin fallback - using public listings to avoid permission errors...');
    
    // Instead of retrying the same failing query, fall back to public listings
    // This ensures admins can still see listings even if there are RLS issues
    return this.fetchPublicListings() as Promise<SBIRListing[]>;
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
