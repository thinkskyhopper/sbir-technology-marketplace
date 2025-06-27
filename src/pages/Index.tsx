
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreateListingDialog from "@/components/CreateListingDialog";
import EditListingDialog from "@/components/EditListingDialog";
import HomePage from "./Index/HomePage";
import MarketplacePage from "./Index/MarketplacePage";
import { useIndexState } from "@/hooks/useIndexState";
import { useIndexNavigation } from "@/hooks/useIndexNavigation";
import type { SBIRListing } from "@/types/listings";

const Index = () => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SBIRListing | null>(null);

  const {
    searchQuery,
    currentView,
    marketplaceFilters,
    setMarketplaceFilters,
    showCreateDialog,
    setShowCreateDialog
  } = useIndexState();

  const {
    handleExploreMarketplace,
    handleSearch,
    handlePostListingClick,
    handleContactAdmin,
    handleFiltersChange
  } = useIndexNavigation();

  const onPostListingClick = () => handlePostListingClick(setShowCreateDialog);
  const onFiltersChange = (filters: any) => {
    setMarketplaceFilters(filters);
    handleFiltersChange(filters);
  };

  const handleEditListing = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setShowEditDialog(true);
  };

  console.log("Current view rendering:", currentView);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSearch={handleSearch} onPostListingClick={onPostListingClick} />

      <div className="flex-1">
        {currentView === "home" ? (
          <HomePage 
            onExploreClick={handleExploreMarketplace}
            onContactAdmin={handleContactAdmin}
            onEditListing={handleEditListing}
          />
        ) : (
          <MarketplacePage
            searchQuery={searchQuery}
            onContactAdmin={handleContactAdmin}
            marketplaceFilters={marketplaceFilters}
            onFiltersChange={onFiltersChange}
          />
        )}
      </div>

      <Footer />
      
      <CreateListingDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <EditListingDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        listing={selectedListing}
      />
    </div>
  );
};

export default Index;
