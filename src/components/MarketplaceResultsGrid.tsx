
import MarketplaceCard from "./MarketplaceCard";
import MarketplacePagination from "./MarketplacePagination";
import type { SBIRListing } from "@/types/listings";
import { useAuth } from "@/contexts/AuthContext";

interface MarketplaceResultsGridProps {
  listings: SBIRListing[];
  onEditListing: (listing: SBIRListing) => void;
  onContactAdmin?: (listing: SBIRListing) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
}

const MarketplaceResultsGrid = ({ 
  listings, 
  onEditListing, 
  onContactAdmin,
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  totalItems
}: MarketplaceResultsGridProps) => {
  const { isAdmin } = useAuth();

  const startItem = (currentPage - 1) * 15 + 1;
  const endItem = Math.min(currentPage * 15, totalItems);

  return (
    <div className="space-y-6">
      {/* Top section - responsive layout */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Listing count - full width on mobile, left on desktop */}
        <div className="text-sm text-muted-foreground md:flex-1">
          Showing {startItem}-{endItem} of {totalItems} listings
        </div>
        
        {/* Pagination - centered on mobile and desktop */}
        <div className="flex justify-center md:flex-1">
          <MarketplacePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        </div>
        
        {/* Page info - hidden on mobile, right aligned on desktop */}
        <div className="hidden md:block text-sm text-muted-foreground md:flex-1 md:text-right">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <MarketplaceCard
            key={listing.id}
            listing={listing}
            onEdit={isAdmin ? onEditListing : undefined}
            onContact={onContactAdmin}
          />
        ))}
      </div>

      {/* Bottom Pagination */}
      <MarketplacePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </div>
  );
};

export default MarketplaceResultsGrid;
