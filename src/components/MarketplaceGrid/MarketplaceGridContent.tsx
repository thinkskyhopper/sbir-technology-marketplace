
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
  categories: string[];
  onClearFilters: () => void;
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
  showPaginationInfo,
  categories,
  onClearFilters
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
    return <MarketplaceNoResults onClearFilters={onClearFilters} />;
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <MarketplaceFilters
          localSearchQuery={filters.localSearchQuery}
          phaseFilter={filters.phaseFilter}
          categoryFilter={filters.categoryFilter}
          statusFilter={filters.statusFilter}
          sortFilter={filters.sortFilter}
          categories={categories}
          onSearchQueryChange={(query) => onFiltersChange({ ...filters, localSearchQuery: query })}
          onPhaseFilterChange={(phase) => onFiltersChange({ ...filters, phaseFilter: phase })}
          onCategoryFilterChange={(category) => onFiltersChange({ ...filters, categoryFilter: category })}
          onStatusFilterChange={(status) => onFiltersChange({ ...filters, statusFilter: status })}
          onSortFilterChange={(sort) => onFiltersChange({ ...filters, sortFilter: sort })}
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
