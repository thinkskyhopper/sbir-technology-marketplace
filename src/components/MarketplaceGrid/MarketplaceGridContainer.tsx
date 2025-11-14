
import { useState, useEffect } from "react";
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
    typeFilter: string;
  };
  onFiltersChange?: (filters: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
    sortFilter: string;
    typeFilter: string;
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
    typeFilter,
    setTypeFilter,
    handleClearFilters,
    isFiltersReady
  } = useMarketplaceFilters({
    preservedFilters,
    onFiltersChange
  });

  const { filteredListings, categories, shouldResetPagination, consumePaginationReset } = useMarketplaceData({
    listings,
    searchQuery,
    localSearchQuery,
    phaseFilter,
    categoryFilter,
    statusFilter,
    sortFilter,
    typeFilter,
    maxListings
  });

  // Determine if we're truly ready to show content
  const isReady = !loading && isFiltersReady;

  // Pagination with the filtered data
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    totalItems,
    resetPagination
  } = usePagination({
    data: filteredListings,
    itemsPerPage: 15
  });

  // Reset pagination when filters change
  useEffect(() => {
    if (shouldResetPagination) {
      resetPagination();
      consumePaginationReset();
    }
  }, [shouldResetPagination, resetPagination, consumePaginationReset]);

  const handleEditListing = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setShowEditDialog(true);
  };

  if (!isReady) {
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
        typeFilter={typeFilter}
        onSearchQueryChange={setLocalSearchQuery}
        onPhaseFilterChange={setPhaseFilter}
        onCategoryFilterChange={setCategoryFilter}
        onStatusFilterChange={setStatusFilter}
        onSortFilterChange={setSortFilter}
        onTypeFilterChange={setTypeFilter}
        onClearFilters={handleClearFilters}
        paginatedData={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        totalItems={totalItems}
        onContactAdmin={onContactAdmin}
        onEditListing={handleEditListing}
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
