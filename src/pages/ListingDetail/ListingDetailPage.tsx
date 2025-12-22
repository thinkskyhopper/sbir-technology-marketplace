
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingDetailLoading from "@/components/ListingDetail/ListingDetailLoading";
import ListingDetailNotFound from "@/components/ListingDetail/ListingDetailNotFound";
import ListingDetailContent from "./ListingDetailContent";
import ListingDetailDialogs from "./ListingDetailDialogs";
import { useListingDetailHandlers } from "./useListingDetailHandlers";
import { useListingDetailMetaTags } from "./useListingDetailMetaTags";

const ListingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { listings, loading, deleteListing } = useListings();
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  
  // Dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRequestChangeDialog, setShowRequestChangeDialog] = useState(false);
  const [showRequestDeletionDialog, setShowRequestDeletionDialog] = useState(false);

  // Find listing by either UUID or public_id (for short URLs)
  const listing = listings.find(l => l.id === id || l.public_id === id);

  // Scroll to top when the page loads or listing changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Custom hooks for handlers and meta tags
  const {
    handleContactAdmin,
    handlePostListingClick,
    handleBackToMarketplace,
    handleDeleteListing,
    handleRequestChange,
    handleRequestDeletion
  } = useListingDetailHandlers({
    user,
    navigate,
    searchParams,
    deleteListing,
    toast,
    setShowContactDialog,
    setShowCreateDialog,
    setShowRequestChangeDialog,
    setShowRequestDeletionDialog
  });

  const handleViewHistory = () => {
    // Use public_id for URLs when available
    navigate(`/listing/${listing?.public_id || id}/history`);
  };

  useListingDetailMetaTags(listing);

  if (loading) {
    return <ListingDetailLoading />;
  }

  if (!listing) {
    return <ListingDetailNotFound onReturnHome={() => navigate("/")} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onPostListingClick={handlePostListingClick} />
      
      <ListingDetailContent
        listing={listing}
        isAdmin={isAdmin}
        isAuthenticated={!!user}
        onBackToMarketplace={handleBackToMarketplace}
        onContactAdmin={handleContactAdmin}
        onEditListing={() => setShowEditDialog(true)}
        onDeleteListing={handleDeleteListing}
        onRequestChange={handleRequestChange}
        onRequestDeletion={handleRequestDeletion}
        onViewHistory={handleViewHistory}
        allListings={listings}
      />

      <Footer />

      <ListingDetailDialogs
        listing={listing}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        showContactDialog={showContactDialog}
        setShowContactDialog={setShowContactDialog}
        showCreateDialog={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
        showRequestChangeDialog={showRequestChangeDialog}
        setShowRequestChangeDialog={setShowRequestChangeDialog}
        showRequestDeletionDialog={showRequestDeletionDialog}
        setShowRequestDeletionDialog={setShowRequestDeletionDialog}
      />
    </div>
  );
};

export default ListingDetailPage;
