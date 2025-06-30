
import React, { useState } from "react";
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

  const listing = listings.find(l => l.id === id);

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
        onBackToMarketplace={handleBackToMarketplace}
        onContactAdmin={handleContactAdmin}
        onEditListing={() => setShowEditDialog(true)}
        onDeleteListing={handleDeleteListing}
        onRequestChange={handleRequestChange}
        onRequestDeletion={handleRequestDeletion}
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
