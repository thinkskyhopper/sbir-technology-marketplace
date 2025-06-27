
import React from "react";
import { useMarketplaceFilters } from "@/hooks/useMarketplaceFilters";
import { useMarketplaceData } from "@/hooks/useMarketplaceData";
import { usePagination } from "@/hooks/usePagination";
import { useListings } from "@/hooks/useListings";
import MarketplaceGridContent from "./MarketplaceGridContent";
import type { SBIRListing } from "@/types/listings";

interface MarketplaceGridContainerProps {
  searchQuery?: string;
  onContactAdmin?: (listing: SBIRListing) => void;
  preservedFilters?: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
    sortFilter: string;
  };
  onFiltersChange?: (filters: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
    sortFilter: string;
  }) => void;
  showFilters?: boolean;
  maxListings?: number;
  showPaginationInfo?: boolean;
}

const MarketplaceGridContainer = ({ 
  searchQuery, 
  onContactAdmin, 
  preservedFilters,
  onFiltersChange,
  showFilters = true,
  maxListings,
  showPaginationInfo = true
}: MarketplaceGridContainerProps) => {
  const {
    localSearchQuery,
    setLocalSearchQuery,
    phaseFilter,
    setPhaseFilter,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sortFilter,
    setSortFilter,
    handleClearFilters
  } = useMarketplaceFilters({
    preservedFilters,
    onFiltersChange
  });

  // Get all listings
  const { data: allListings = [], isLoading, error } = useListings();

  // Apply filters to get filtered listings
  const { filteredListings, categories } = useMarketplaceData({
    listings: allListings,
    searchQuery,
    localSearchQuery,
    phaseFilter,
    categoryFilter,
    statusFilter,
    sortFilter,
    maxListings
  });

  // Setup pagination with filtered listings
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    totalItems
  } = usePagination({
    data: filteredListings,
    itemsPerPage: maxListings || 15
  });

  const handleFiltersChange = (filters: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
    sortFilter: string;
  }) => {
    setLocalSearchQuery(filters.localSearchQuery);
    setPhaseFilter(filters.phaseFilter);
    setCategoryFilter(filters.categoryFilter);
    setStatusFilter(filters.statusFilter);
    setSortFilter(filters.sortFilter);
  };

  const filters = {
    localSearchQuery,
    phaseFilter,
    categoryFilter,
    statusFilter,
    sortFilter
  };

  return (
    <MarketplaceGridContent
      listings={maxListings ? filteredListings : paginatedData}
      totalCount={totalItems}
      isLoading={isLoading}
      error={error}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onContactAdmin={onContactAdmin}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      showFilters={showFilters}
      showPaginationInfo={showPaginationInfo}
      categories={categories}
      onClearFilters={handleClearFilters}
    />
  );
};

export default MarketplaceGridContainer;
