
import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";
import EditListingDialog from "@/components/EditListingDialog";
import ContactAdminDialog from "@/components/ContactAdminDialog";
import ListingDetailHeader from "@/components/ListingDetail/ListingDetailHeader";
import ListingDetailHeroImage from "@/components/ListingDetail/ListingDetailHeroImage";
import ListingDetailDescription from "@/components/ListingDetail/ListingDetailDescription";
import ListingDetailInfo from "@/components/ListingDetail/ListingDetailInfo";
import ListingDetailSidebar from "@/components/ListingDetail/ListingDetailSidebar";
import ListingDetailLoading from "@/components/ListingDetail/ListingDetailLoading";
import ListingDetailNotFound from "@/components/ListingDetail/ListingDetailNotFound";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { listings, loading } = useListings();
  const { isAdmin } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const listing = listings.find(l => l.id === id);

  if (loading) {
    return <ListingDetailLoading />;
  }

  if (!listing) {
    return <ListingDetailNotFound onReturnHome={() => navigate("/")} />;
  }

  const handleContactAdmin = () => {
    setShowContactDialog(true);
  };

  const handleBackToMarketplace = () => {
    // Preserve any existing marketplace filters in the URL
    const marketplaceParams = new URLSearchParams();
    marketplaceParams.set("view", "marketplace");
    
    // Copy relevant filter parameters if they exist
    if (searchParams.get("search")) marketplaceParams.set("search", searchParams.get("search")!);
    if (searchParams.get("phase")) marketplaceParams.set("phase", searchParams.get("phase")!);
    if (searchParams.get("category")) marketplaceParams.set("category", searchParams.get("category")!);
    if (searchParams.get("status")) marketplaceParams.set("status", searchParams.get("status")!);
    
    navigate(`/?${marketplaceParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ListingDetailHeader
        listing={listing}
        isAdmin={isAdmin}
        onBackToMarketplace={handleBackToMarketplace}
        onContactAdmin={handleContactAdmin}
        onEditListing={() => setShowEditDialog(true)}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <ListingDetailHeroImage 
              listing={{
                category: listing.category,
                agency: listing.agency,
                photo_url: listing.photo_url,
                title: listing.title
              }} 
            />

            {/* Description */}
            <ListingDetailDescription description={listing.description} />

            {/* Contract Details */}
            <ListingDetailInfo listing={listing} />
          </div>

          {/* Sidebar */}
          <ListingDetailSidebar
            listing={listing}
            onContactAdmin={handleContactAdmin}
          />
        </div>
      </div>

      {/* Edit Dialog */}
      <EditListingDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        listing={listing}
      />

      {/* Contact Dialog */}
      {listing && (
        <ContactAdminDialog
          open={showContactDialog}
          onOpenChange={setShowContactDialog}
          listing={listing}
        />
      )}
    </div>
  );
};

export default ListingDetail;
