import React from "react";
import { useMarketplaceData } from "@/hooks/useMarketplaceData";
import { useMarketplaceFilters } from "@/hooks/useMarketplaceFilters";
import { usePagination } from "@/hooks/usePagination";
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
  const { filters, handleFiltersChange } = useMarketplaceFilters({
    initialFilters: preservedFilters,
    onFiltersChange: onFiltersChange
  });

  const {
    data: listings,
    isLoading,
    error
  } = useMarketplaceData({
    searchQuery: filters.localSearchQuery,
    phaseFilter: filters.phaseFilter,
    categoryFilter: filters.categoryFilter,
    statusFilter: filters.statusFilter,
    sortFilter: filters.sortFilter,
    page: currentPage,
    limit: maxListings || 15
  });

  const { currentPage, totalPages, onPageChange, hasNextPage, hasPreviousPage } = usePagination({
    totalItems: listings?.totalCount || 0,
    itemsPerPage: maxListings || 15
  });

  return (
    <MarketplaceGridContent
      listings={listings?.data || []}
      totalCount={listings?.totalCount || 0}
      isLoading={isLoading}
      error={error}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onContactAdmin={onContactAdmin}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      showFilters={showFilters}
      showPaginationInfo={showPaginationInfo}
    />
  );
};

export default MarketplaceGridContainer;
