import React from "react";
import MarketplaceFilters from "@/components/MarketplaceFilters";
import MarketplaceResultsGrid from "@/components/MarketplaceResultsGrid";
import MarketplaceLoading from "@/components/MarketplaceLoading";
import MarketplaceNoResults from "@/components/MarketplaceNoResults";
import type { SBIRListing } from "@/types/listings";
import { useNavigate } from "react-router-dom";

interface MarketplaceGridContentProps {
  listings: SBIRListing[];
  totalCount: number;
  isLoading: boolean;
  error: any;
  filters: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
    sortFilter: string;
  };
  onFiltersChange: (filters: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
    sortFilter: string;
  }) => void;
  onContactAdmin?: (listing: SBIRListing) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  showFilters: boolean;
  showPaginationInfo: boolean;
}

const MarketplaceGridContent = ({
  listings,
  totalCount,
  isLoading,
  error,
  filters,
  onFiltersChange,
  onContactAdmin,
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  showFilters,
  showPaginationInfo
}: MarketplaceGridContentProps) => {
  const navigate = useNavigate();

  const handleEditListing = (listing: SBIRListing) => {
    navigate(`/admin/edit/${listing.id}`);
  };

  if (isLoading) {
    return <MarketplaceLoading />;
  }

  if (error) {
    console.error("Error loading listings:", error);
    return <MarketplaceNoResults />;
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <MarketplaceFilters
          searchQuery={filters.localSearchQuery}
          phaseFilter={filters.phaseFilter}
          categoryFilter={filters.categoryFilter}
          statusFilter={filters.statusFilter}
          sortFilter={filters.sortFilter}
          onFiltersChange={onFiltersChange}
        />
      )}

      <MarketplaceResultsGrid
        listings={listings}
        onEditListing={handleEditListing}
        onContactAdmin={onContactAdmin}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        totalItems={totalCount}
        showPaginationInfo={showPaginationInfo}
      />
    </div>
  );
};

export default MarketplaceGridContent;
