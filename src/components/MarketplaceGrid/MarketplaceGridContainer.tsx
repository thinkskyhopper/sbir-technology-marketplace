
import { useState } from "react";
import EditListingDialog from "../EditListingDialog";
import MarketplaceGridContent from "./MarketplaceGridContent";
import MarketplaceLoading from "../MarketplaceLoading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useListings } from "@/hooks/useListings";
import { usePagination } from "@/hooks/usePagination";
import { useMarketplaceFilters } from "@/hooks/useMarketplaceFilters";
import { useMarketplaceData } from "@/hooks/useMarketplaceData";
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
}

const MarketplaceGridContainer = ({ 
  searchQuery, 
  onContactAdmin, 
  preservedFilters,
  onFiltersChange,
  showFilters = true,
  maxListings
}: MarketplaceGridContainerProps) => {
  const { listings, loading, error } = useListings();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SBIRListing | null>(null);

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

  // Pagination hook - 15 items per page
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    resetPagination,
    totalItems
  } = usePagination({
    data: [],
    itemsPerPage: 15
  });

  const { filteredListings, categories } = useMarketplaceData({
    listings,
    searchQuery,
    localSearchQuery,
    phaseFilter,
    categoryFilter,
    statusFilter,
    sortFilter,
    maxListings,
    resetPagination
  });

  // Update pagination data when filtered listings change
  const {
    currentPage: finalCurrentPage,
    totalPages: finalTotalPages,
    paginatedData: finalPaginatedData,
    goToPage: finalGoToPage,
    hasNextPage: finalHasNextPage,
    hasPreviousPage: finalHasPreviousPage,
    totalItems: finalTotalItems
  } = usePagination({
    data: filteredListings,
    itemsPerPage: 15
  });

  const handleEditListing = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setShowEditDialog(true);
  };

  if (loading) {
    return <MarketplaceLoading />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading contracts: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <MarketplaceGridContent
        showFilters={showFilters}
        filteredListings={filteredListings}
        categories={categories}
        localSearchQuery={localSearchQuery}
        phaseFilter={phaseFilter}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        sortFilter={sortFilter}
        onSearchQueryChange={setLocalSearchQuery}
        onPhaseFilterChange={setPhaseFilter}
        onCategoryFilterChange={setCategoryFilter}
        onStatusFilterChange={setStatusFilter}
        onSortFilterChange={setSortFilter}
        onClearFilters={handleClearFilters}
        onEditListing={handleEditListing}
        onContactAdmin={onContactAdmin}
        currentPage={finalCurrentPage}
        totalPages={finalTotalPages}
        paginatedData={finalPaginatedData}
        onPageChange={finalGoToPage}
        hasNextPage={finalHasNextPage}
        hasPreviousPage={finalHasPreviousPage}
        totalItems={finalTotalItems}
      />

      {/* Edit Dialog */}
      <EditListingDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        listing={selectedListing}
      />
    </>
  );
};

export default MarketplaceGridContainer;
