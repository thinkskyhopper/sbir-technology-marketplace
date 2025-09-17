
import type { SBIRListing } from "@/types/listings";
import ListingDetailHeader from "@/components/ListingDetail/ListingDetailHeader";
import ListingDetailHeroImage from "@/components/ListingDetail/ListingDetailHeroImage";
import ListingDetailDescription from "@/components/ListingDetail/ListingDetailDescription";
import ListingDetailSidebar from "@/components/ListingDetail/ListingDetailSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Building, Clock, Tag, Settings } from "lucide-react";

interface ListingDetailContentProps {
  listing: SBIRListing;
  isAdmin: boolean;
  onBackToMarketplace: () => void;
  onContactAdmin: () => void;
  onEditListing: () => void;
  onDeleteListing: (listingId: string) => void;
  onRequestChange: () => void;
  onRequestDeletion: () => void;
  onViewHistory?: () => void;
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
  onViewHistory,
  allListings = []
}: ListingDetailContentProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    // Parse the date string as a local date to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
        onViewHistory={onViewHistory}
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

        {/* Mobile layout: Key Information above description, rest below */}
        <div className="block lg:hidden space-y-6">
          <ListingDetailHeroImage listing={listing} />
          
          {/* Key Information only */}
          <Card>
            <CardHeader>
              <CardTitle>Key Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                <div>
                  <p className="font-semibold">Date Listed</p>
                  <p className="text-muted-foreground">
                    {listing.approved_at ? formatDateTime(listing.approved_at) : formatDateTime(listing.submitted_at)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                <div>
                  <p className="font-semibold">Sale Price</p>
                  <p className="text-muted-foreground">{formatCurrency(listing.value)}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Building className="w-4 h-4 mr-2 text-blue-500" />
                <div>
                  <p className="font-semibold">Agency</p>
                  <p className="text-muted-foreground">{listing.agency}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Settings className="w-4 h-4 mr-2 text-purple-500" />
                <div>
                  <p className="font-semibold">Phase</p>
                  <p className="text-muted-foreground">{listing.phase}</p>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Tag className="w-4 h-4 mr-2 text-orange-500" />
                <div>
                  <p className="font-semibold">Category</p>
                  <p className="text-muted-foreground">{listing.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ListingDetailDescription description={listing.description} />
          
          {/* Contact and Related Listings sections below description */}
          <ListingDetailSidebar
            listing={listing}
            onContactAdmin={onContactAdmin}
            allListings={allListings}
            isCurrentUserAdmin={isAdmin}
            showOnlyContactAndRelated={true}
          />
        </div>
      </div>
    </>
  );
};

export default ListingDetailContent;
