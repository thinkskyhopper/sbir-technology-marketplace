
import MarketplaceFilters from "../MarketplaceFilters";
import MarketplaceResultsGrid from "../MarketplaceResultsGrid";
import MarketplaceNoResults from "../MarketplaceNoResults";
import SignInPromptCard from "../SignInPromptCard";
import type { SBIRListing } from "@/types/listings";
import { useAuth } from "@/contexts/AuthContext";

interface MarketplaceGridContentProps {
  showFilters: boolean;
  filteredListings: SBIRListing[];
  categories: string[];
  localSearchQuery: string;
  phaseFilter: string;
  categoryFilter: string;
  statusFilter: string;
  sortFilter: string;
  onSearchQueryChange: (query: string) => void;
  onPhaseFilterChange: (phase: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onStatusFilterChange: (status: string) => void;
  onSortFilterChange: (sort: string) => void;
  onClearFilters: () => void;
  onEditListing: (listing: SBIRListing) => void;
  onContactAdmin?: (listing: SBIRListing) => void;
  onSignIn?: () => void;
  currentPage: number;
  totalPages: number;
  paginatedData: SBIRListing[];
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
}

const MarketplaceGridContent = ({
  showFilters,
  filteredListings,
  categories,
  localSearchQuery,
  phaseFilter,
  categoryFilter,
  statusFilter,
  sortFilter,
  onSearchQueryChange,
  onPhaseFilterChange,
  onCategoryFilterChange,
  onStatusFilterChange,
  onSortFilterChange,
  onClearFilters,
  onEditListing,
  onContactAdmin,
  onSignIn,
  currentPage,
  totalPages,
  paginatedData,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  totalItems
}: MarketplaceGridContentProps) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Search and Filters - Only show if showFilters is true */}
      {showFilters && (
        <div className="space-y-4">
          {/* Sign-in prompt for unauthenticated users */}
          {!user && onSignIn && (
            <div className="flex justify-end">
              <div className="w-full sm:w-80">
                <SignInPromptCard onSignIn={onSignIn} />
              </div>
            </div>
          )}
          
          <MarketplaceFilters
          localSearchQuery={localSearchQuery}
          phaseFilter={phaseFilter}
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          sortFilter={sortFilter}
          categories={categories}
          onSearchQueryChange={onSearchQueryChange}
          onPhaseFilterChange={onPhaseFilterChange}
          onCategoryFilterChange={onCategoryFilterChange}
          onStatusFilterChange={onStatusFilterChange}
          onSortFilterChange={onSortFilterChange}
        />
        </div>
      )}

      {/* Results */}
      {filteredListings.length > 0 ? (
        <MarketplaceResultsGrid
          listings={paginatedData}
          onEditListing={onEditListing}
          onContactAdmin={onContactAdmin}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          totalItems={totalItems}
        />
      ) : (
        <MarketplaceNoResults onClearFilters={onClearFilters} />
      )}
    </div>
  );
};

export default MarketplaceGridContent;
