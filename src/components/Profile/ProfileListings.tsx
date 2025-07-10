
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { SBIRListing } from "@/types/listings";
import { usePagination } from "@/hooks/usePagination";
import { useProfileListings } from "@/hooks/useProfileListings";
import ProfileListingsHeader from "./ProfileListings/ProfileListingsHeader";
import ProfileListingsContent from "./ProfileListings/ProfileListingsContent";
import ProfileListingsLoading from "./ProfileListings/ProfileListingsLoading";
import ProfileListingsDialogManager from "./ProfileListings/ProfileListingsDialogManager";

interface ProfileListingsProps {
  userId?: string | null;
  isOwnProfile: boolean;
}

const ProfileListings = ({ userId, isOwnProfile }: ProfileListingsProps) => {
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [requestChangeDialogOpen, setRequestChangeDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SBIRListing | null>(null);

  // Fetch listings data
  const { data: listings, isLoading, error } = useProfileListings({ userId, isOwnProfile });

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
    userId
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
          <ProfileListingsContent
            listings={listings}
            paginatedListings={paginatedListings}
            isViewingOwnProfile={isOwnProfile}
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onEditListing={handleEditListing}
            onRequestChange={handleRequestChange}
            onPageChange={goToPage}
          />
        </CardContent>
      </Card>

      <ProfileListingsDialogManager
        selectedListing={selectedListing}
        editDialogOpen={editDialogOpen}
        requestChangeDialogOpen={requestChangeDialogOpen}
        onEditDialogOpenChange={setEditDialogOpen}
        onRequestChangeDialogOpenChange={setRequestChangeDialogOpen}
      />
    </>
  );
};

export default ProfileListings;
