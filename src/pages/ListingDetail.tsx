
import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";
import { useMetaTags } from "@/hooks/useMetaTags";
import Header from "@/components/Header";
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

  // Generate listing-specific metadata
  const getListingImage = () => {
    if (!listing) return '/lovable-uploads/f964523f-f4e2-493f-94a1-a80c35e6a6f4.png';
    
    const categoryLower = listing.category.toLowerCase();
    
    if (categoryLower.includes('cyber') || categoryLower.includes('security')) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('software') || categoryLower.includes('ai') || categoryLower.includes('data')) {
      return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('hardware') || categoryLower.includes('electronic')) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('autonomous')) {
      return "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('biomedical') || categoryLower.includes('medical')) {
      return "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('quantum')) {
      return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('space')) {
      return "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('advanced materials') || categoryLower.includes('materials')) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else {
      return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Set up dynamic meta tags for the listing
  useMetaTags({
    title: listing ? `${listing.title} - SBIR Tech Marketplace` : 'The SBIR Tech Marketplace',
    description: listing ? 
      `${listing.phase} ${listing.category} project from ${listing.agency}. Value: ${formatCurrency(listing.value)}. ${listing.description.substring(0, 150)}...` : 
      'Helping generate revenue from past SBIR/STTR awards by connecting interested buyers, teaming partners and federal customers.',
    image: getListingImage(),
    url: listing ? `${window.location.origin}/listing/${listing.id}` : window.location.href,
    type: 'article'
  });

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
      {/* Main Site Header */}
      <Header />
      
      {/* Listing Specific Header */}
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
            <ListingDetailHeroImage listing={listing} />

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
