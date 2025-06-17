import { useState, useEffect, useRef } from "react";
import EditListingDialog from "./EditListingDialog";
import MarketplaceFilters from "./MarketplaceFilters";
import MarketplaceResultsGrid from "./MarketplaceResultsGrid";
import MarketplaceNoResults from "./MarketplaceNoResults";
import MarketplaceLoading from "./MarketplaceLoading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useListings } from "@/hooks/useListings";
import type { SBIRListing } from "@/types/listings";

interface MarketplaceGridProps {
  searchQuery?: string;
  onContactAdmin?: (listing: SBIRListing) => void;
  preservedFilters?: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
  };
  onFiltersChange?: (filters: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
  }) => void;
}

const MarketplaceGrid = ({ 
  searchQuery, 
  onContactAdmin, 
  preservedFilters,
  onFiltersChange 
}: MarketplaceGridProps) => {
  const { listings, loading, error } = useListings();
  const [filteredListings, setFilteredListings] = useState<SBIRListing[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState(preservedFilters?.localSearchQuery || "");
  const [phaseFilter, setPhaseFilter] = useState<string>(preservedFilters?.phaseFilter || "all");
  const [categoryFilter, setCategoryFilter] = useState<string>(preservedFilters?.categoryFilter || "all");
  const [statusFilter, setStatusFilter] = useState<string>(preservedFilters?.statusFilter || "active");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SBIRListing | null>(null);
  const isInitialMount = useRef(true);
  const isSyncingFromURL = useRef(false);

  // Update local state when preservedFilters change
  useEffect(() => {
    if (preservedFilters) {
      isSyncingFromURL.current = true;
      setLocalSearchQuery(preservedFilters.localSearchQuery);
      setPhaseFilter(preservedFilters.phaseFilter);
      setCategoryFilter(preservedFilters.categoryFilter);
      setStatusFilter(preservedFilters.statusFilter);
      // Reset the flag after a brief delay to allow state updates to complete
      setTimeout(() => {
        isSyncingFromURL.current = false;
      }, 0);
    }
  }, [preservedFilters]);

  // Notify parent component when filters change, but skip initial mount and URL sync
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (isSyncingFromURL.current) {
      return;
    }
    
    if (onFiltersChange) {
      onFiltersChange({
        localSearchQuery,
        phaseFilter,
        categoryFilter,
        statusFilter
      });
    }
  }, [localSearchQuery, phaseFilter, categoryFilter, statusFilter, onFiltersChange]);

  const applyFilters = () => {
    let filtered = listings;

    // Apply search query (from prop or local)
    const query = searchQuery || localSearchQuery;
    if (query) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(query.toLowerCase()) ||
        listing.description.toLowerCase().includes(query.toLowerCase()) ||
        listing.agency.toLowerCase().includes(query.toLowerCase()) ||
        listing.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply phase filter
    if (phaseFilter !== "all") {
      filtered = filtered.filter(listing => listing.phase === phaseFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(listing => listing.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter === "active") {
      filtered = filtered.filter(listing => listing.status === "Active");
    } else if (statusFilter !== "all") {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    setFilteredListings(filtered);
  };

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [listings, searchQuery, localSearchQuery, phaseFilter, categoryFilter, statusFilter]);

  const handleEditListing = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setShowEditDialog(true);
  };

  const handleClearFilters = () => {
    setLocalSearchQuery("");
    setPhaseFilter("all");
    setCategoryFilter("all");
    setStatusFilter("active");
  };

  const categories = Array.from(new Set(listings.map(listing => listing.category)));

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
    <div className="space-y-6">
      {/* Search and Filters */}
      <MarketplaceFilters
        localSearchQuery={localSearchQuery}
        phaseFilter={phaseFilter}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        categories={categories}
        onSearchQueryChange={setLocalSearchQuery}
        onPhaseFilterChange={setPhaseFilter}
        onCategoryFilterChange={setCategoryFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Results */}
      {filteredListings.length > 0 ? (
        <MarketplaceResultsGrid
          listings={filteredListings}
          onEditListing={handleEditListing}
          onContactAdmin={onContactAdmin}
        />
      ) : (
        <MarketplaceNoResults onClearFilters={handleClearFilters} />
      )}

      {/* Edit Dialog */}
      <EditListingDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        listing={selectedListing}
      />
    </div>
  );
};

export default MarketplaceGrid;
