
import type { SBIRListing } from "@/types/listings";
import ListingDetailHeader from "@/components/ListingDetail/ListingDetailHeader";
import ListingDetailHeroImage from "@/components/ListingDetail/ListingDetailHeroImage";
import ListingDetailDescription from "@/components/ListingDetail/ListingDetailDescription";
import ListingDetailInfo from "@/components/ListingDetail/ListingDetailInfo";
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
}

const ListingDetailContent = ({
  listing,
  isAdmin,
  onBackToMarketplace,
  onContactAdmin,
  onEditListing,
  onDeleteListing,
  onRequestChange,
  onRequestDeletion
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
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ListingDetailHeroImage listing={listing} />
            <ListingDetailDescription description={listing.description} />
            <ListingDetailInfo listing={listing} />
          </div>

          <ListingDetailSidebar
            listing={listing}
            onContactAdmin={onContactAdmin}
          />
        </div>
      </div>
    </>
  );
};

export default ListingDetailContent;
