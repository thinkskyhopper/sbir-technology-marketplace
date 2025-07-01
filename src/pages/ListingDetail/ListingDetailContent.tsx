
import type { SBIRListing } from "@/types/listings";
import ListingDetailHeader from "@/components/ListingDetail/ListingDetailHeader";
import ListingDetailHeroImage from "@/components/ListingDetail/ListingDetailHeroImage";
import ListingDetailDescription from "@/components/ListingDetail/ListingDetailDescription";
import ListingDetailSidebar from "@/components/ListingDetail/ListingDetailSidebar";

interface ListingDetailContentProps {
  listing: SBIRListing;
  isAdmin: boolean;
  onBackToMarketplace: () => void;
  onContactAdmin: () => void;
  onEditListing: () => void;
  onDeleteListing: (listingId: string) => void;
  onRequestChange: () => void;
  onRequestDeletion: () => void;
  allListings?: SBIRListing[];
}

const ListingDetailContent = ({
  listing,
  isAdmin,
  onBackToMarketplace,
  onContactAdmin,
  onEditListing,
  onDeleteListing,
  onRequestChange,
  onRequestDeletion,
  allListings = []
}: ListingDetailContentProps) => {
  return (
    <>
      <ListingDetailHeader
        listing={listing}
        isAdmin={isAdmin}
        onBackToMarketplace={onBackToMarketplace}
        onContactAdmin={onContactAdmin}
        onEditListing={onEditListing}
        onDeleteListing={onDeleteListing}
        onRequestChange={onRequestChange}
        onRequestDeletion={onRequestDeletion}
      />

      <div className="container mx-auto px-6 py-8 flex-1">
        {/* Desktop layout: sidebar on the right */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ListingDetailHeroImage listing={listing} />
            <ListingDetailDescription description={listing.description} />
          </div>

          <ListingDetailSidebar
            listing={listing}
            onContactAdmin={onContactAdmin}
            allListings={allListings}
            isCurrentUserAdmin={isAdmin}
          />
        </div>

        {/* Mobile layout: Key Information above description */}
        <div className="block lg:hidden space-y-6">
          <ListingDetailHeroImage listing={listing} />
          
          <ListingDetailSidebar
            listing={listing}
            onContactAdmin={onContactAdmin}
            allListings={allListings}
            isCurrentUserAdmin={isAdmin}
          />
          
          <ListingDetailDescription description={listing.description} />
        </div>
      </div>
    </>
  );
};

export default ListingDetailContent;
