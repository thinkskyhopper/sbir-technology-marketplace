
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";
import { useMetaTags } from "@/hooks/useMetaTags";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MarketplaceFilters from "@/components/MarketplaceFilters";
import MarketplaceResultsGrid from "@/components/MarketplaceResultsGrid";
import Footer from "@/components/Footer";
import CreateListingDialog from "@/components/CreateListingDialog";
import type { SBIRListing } from "@/types/listings";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { listings, loading, error } = useListings();
  const { user } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filteredListings, setFilteredListings] = useState<SBIRListing[]>([]);

  // Set up meta tags for the homepage
  useMetaTags({
    title: "The SBIR Tech Marketplace - Generate Revenue from Past SBIR/STTR Awards",
    description: "Helping generate revenue from past SBIR/STTR awards by connecting interested buyers, teaming partners and federal customers.",
    image: "/lovable-uploads/f964523f-f4e2-493f-94a1-a80c35e6a6f4.png",
    url: window.location.href,
    type: "website"
  });

  // Determine the current view based on URL parameters
  const currentView = searchParams.get("view") || "hero";
  const isMarketplaceView = currentView === "marketplace";

  // Simple filter function that doesn't trigger URL changes
  const applyFilters = (filters: Record<string, string>) => {
    if (!listings.length) {
      setFilteredListings([]);
      return;
    }

    // Start with all listings (don't pre-filter by status here since useListings already handles this)
    let filtered = [...listings];

    const searchQuery = filters.search;
    const phaseFilter = filters.phase;
    const categoryFilter = filters.category;
    const statusFilter = filters.status;

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.agency.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query)
      );
    }

    if (phaseFilter && phaseFilter !== "all") {
      filtered = filtered.filter(listing => listing.phase === phaseFilter);
    }

    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter(listing => listing.category === categoryFilter);
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    setFilteredListings(filtered);
  };

  // Initial filter application when listings change
  useEffect(() => {
    if (isMarketplaceView) {
      const initialFilters = {
        search: searchParams.get("search") || "",
        phase: searchParams.get("phase") || "all",
        category: searchParams.get("category") || "all",
        status: searchParams.get("status") || "all"
      };
      applyFilters(initialFilters);
    } else {
      // For hero view, show the 6 newest listings without any filters
      if (listings.length > 0) {
        setFilteredListings(listings.slice(0, 6));
      }
    }
  }, [listings, searchParams, isMarketplaceView]);

  const handleSearch = (query: string) => {
    try {
      const newParams = new URLSearchParams(searchParams);
      if (query.trim()) {
        newParams.set("search", query);
      } else {
        newParams.delete("search");
      }
      newParams.set("view", "marketplace");
      setSearchParams(newParams, { replace: true });
    } catch (error) {
      console.warn("URL update failed, applying filters locally", error);
      // Apply filters locally if URL update fails
      applyFilters({
        search: query,
        phase: "all",
        category: "all",
        status: "all"
      });
    }
  };

  const handleViewMarketplace = () => {
    try {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("view", "marketplace");
      setSearchParams(newParams, { replace: true });
    } catch (error) {
      console.warn("URL update failed", error);
    }
  };

  const handlePostListing = () => {
    setShowCreateDialog(true);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    // Just apply filters locally without URL manipulation
    applyFilters(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      phase: "all",
      category: "all",
      status: "all"
    };
    applyFilters(clearedFilters);
    
    try {
      const newParams = new URLSearchParams();
      newParams.set("view", "marketplace");
      setSearchParams(newParams, { replace: true });
    } catch (error) {
      console.warn("URL update failed during clear", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onSearch={handleSearch}
        onPostListingClick={handlePostListing}
      />
      
      <main className="flex-1">
        {!isMarketplaceView ? (
          <Hero onViewMarketplace={handleViewMarketplace} />
        ) : (
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">SBIR Tech Marketplace</h1>
              <p className="text-muted-foreground">
                Discover and connect with innovative SBIR/STTR technologies
              </p>
            </div>
            
            <MarketplaceFilters
              onFilterChange={handleFilterChange}
              initialFilters={{
                search: searchParams.get("search") || "",
                phase: searchParams.get("phase") || "all",
                category: searchParams.get("category") || "all",
                status: searchParams.get("status") || "all"
              }}
            />
            
            <MarketplaceResultsGrid
              listings={filteredListings}
              loading={loading}
              error={error}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}
      </main>
      
      <Footer />
      
      <CreateListingDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default Index;
