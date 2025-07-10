
import ProfileListingCard from "./ProfileListingCard";
import ProfileListingsEmpty from "./ProfileListingsEmpty";
import MarketplacePagination from "../../MarketplacePagination";
import type { SBIRListing } from "@/types/listings";

interface ProfileListingsContentProps {
  listings: SBIRListing[] | undefined;
  paginatedListings: SBIRListing[];
  isViewingOwnProfile: boolean;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onEditListing: (listing: SBIRListing) => void;
  onRequestChange: (listing: SBIRListing) => void;
  onPageChange: (page: number) => void;
}

const ProfileListingsContent = ({
  listings,
  paginatedListings,
  isViewingOwnProfile,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onEditListing,
  onRequestChange,
  onPageChange
}: ProfileListingsContentProps) => {
  if (!listings || listings.length === 0) {
    return <ProfileListingsEmpty isViewingOwnProfile={isViewingOwnProfile} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedListings.map((listing) => (
          <ProfileListingCard
            key={listing.id}
            listing={listing}
            isViewingOwnProfile={isViewingOwnProfile}
            onEditListing={onEditListing}
            onRequestChange={onRequestChange}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <MarketplacePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      )}
    </>
  );
};

export default ProfileListingsContent;
