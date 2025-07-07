
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import type { SBIRListing } from "@/types/listings";
import { usePagination } from "@/hooks/usePagination";
import ProfileListingsHeader from "./ProfileListings/ProfileListingsHeader";
import ProfileListingCard from "./ProfileListings/ProfileListingCard";
import ProfileListingsEmpty from "./ProfileListings/ProfileListingsEmpty";
import ProfileListingsLoading from "./ProfileListings/ProfileListingsLoading";
import EditListingDialog from "../EditListingDialog";
import RequestChangeDialog from "../RequestChangeDialog";
import MarketplacePagination from "../MarketplacePagination";

interface ProfileListingsProps {
  userId?: string | null;
  isOwnProfile: boolean;
}

const ProfileListings = ({ userId, isOwnProfile }: ProfileListingsProps) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const targetUserId = userId || user?.id;

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [requestChangeDialogOpen, setRequestChangeDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SBIRListing | null>(null);

  console.log('📋 ProfileListings props:', {
    userId,
    isOwnProfile,
    targetUserId,
    userEmail: user?.email,
    isAdmin
  });

  const { data: listings, isLoading, error } = useQuery({
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
          .order('created_at', { ascending: false });

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

        console.log('✅ Profile listings fetched successfully:', {
          count: formattedListings?.length || 0,
          listings: formattedListings?.map(l => ({ 
            id: l.id, 
            title: l.title, 
            status: l.status,
            value: l.value // This should now be in dollars
          })) || []
        });
        
        return formattedListings;
      } catch (error) {
        console.error('💥 Query failed:', error);
        throw error;
      }
    },
    enabled: !!targetUserId,
    retry: 1,
    staleTime: 30000 // 30 seconds
  });

  // Initialize pagination with 15 items per page
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedListings,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    totalItems
  } = usePagination({
    data: listings || [],
    itemsPerPage: 15
  });

  const handleEditListing = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setEditDialogOpen(true);
  };

  const handleRequestChange = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setRequestChangeDialogOpen(true);
  };

  if (isLoading) {
    console.log('⏳ ProfileListings showing loading state');
    return <ProfileListingsLoading />;
  }

  if (error) {
    console.error('💥 ProfileListings error:', error);
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading listings: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('🎨 Rendering ProfileListings:', {
    listingsCount: listings?.length || 0,
    paginatedCount: paginatedListings?.length || 0,
    currentPage,
    totalPages,
    isOwnProfile,
    targetUserId
  });

  return (
    <>
      <Card>
        <ProfileListingsHeader
          listingCount={totalItems}
          isViewingOwnProfile={isOwnProfile}
          createDialogOpen={createDialogOpen}
          onCreateDialogOpenChange={setCreateDialogOpen}
        />
        <CardContent>
          {!listings || listings.length === 0 ? (
            <ProfileListingsEmpty isViewingOwnProfile={isOwnProfile} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedListings.map((listing) => (
                  <ProfileListingCard
                    key={listing.id}
                    listing={listing}
                    isViewingOwnProfile={isOwnProfile}
                    onEditListing={handleEditListing}
                    onRequestChange={handleRequestChange}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <MarketplacePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditListingDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        listing={selectedListing}
      />
      
      <RequestChangeDialog
        open={requestChangeDialogOpen}
        onOpenChange={setRequestChangeDialogOpen}
        listing={selectedListing}
      />
    </>
  );
};

export default ProfileListings;
