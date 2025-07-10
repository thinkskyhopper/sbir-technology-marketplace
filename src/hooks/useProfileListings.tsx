
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { SBIRListing } from "@/types/listings";

interface UseProfileListingsProps {
  userId?: string | null;
  isOwnProfile: boolean;
}

export const useProfileListings = ({ userId, isOwnProfile }: UseProfileListingsProps) => {
  const { user, isAdmin } = useAuth();
  const targetUserId = userId || user?.id;

  console.log('📋 useProfileListings props:', {
    userId,
    isOwnProfile,
    targetUserId,
    userEmail: user?.email,
    isAdmin
  });

  return useQuery({
    queryKey: ['profile-listings', targetUserId],
    queryFn: async () => {
      if (!targetUserId) {
        console.log('❌ No target user ID, returning empty array');
        return [];
      }
      
      console.log('🔍 Fetching listings for user:', targetUserId, {
        isOwnProfile, 
        isAdmin,
        userEmail: user?.email
      });
      
      try {
        let query = supabase
          .from('sbir_listings')
          .select('*')
          .eq('user_id', targetUserId)
          .in('status', ['Active', 'Sold'])
          .order('submitted_at', { ascending: false }); // Sort by date listed (newest first)

        const { data, error } = await query;

        if (error) {
          console.error('❌ Error fetching profile listings:', error);
          throw error;
        }

        // Convert value from cents to dollars and format dates - same logic as main listings service
        const formattedListings = data?.map(listing => ({
          ...listing,
          value: listing.value / 100, // Convert cents to dollars
          deadline: new Date(listing.deadline).toISOString().split('T')[0],
          profiles: null // Profile listings don't include profile data
        })) || [];

        // Additional client-side sort to ensure consistent ordering by submitted_at
        const sortedListings = formattedListings.sort((a, b) => {
          const dateA = new Date(a.submitted_at).getTime();
          const dateB = new Date(b.submitted_at).getTime();
          return dateB - dateA; // Newest first
        });

        console.log('✅ Profile listings fetched and sorted successfully:', {
          count: sortedListings?.length || 0,
          listings: sortedListings?.map(l => ({ 
            id: l.id, 
            title: l.title, 
            status: l.status,
            value: l.value, // This should now be in dollars
            submitted_at: l.submitted_at
          })) || []
        });
        
        return sortedListings;
      } catch (error) {
        console.error('💥 Query failed:', error);
        throw error;
      }
    },
    enabled: !!targetUserId,
    retry: 1,
    staleTime: 30000 // 30 seconds
  });
};
