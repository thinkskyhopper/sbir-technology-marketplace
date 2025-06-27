
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
      {/* Top section with listing count (left), pagination (center), and page info (right) */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex-1">
          Showing {startItem}-{endItem} of {totalItems} listings
        </div>
        <div className="flex-1 flex justify-center">
          <MarketplacePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        </div>
        <div className="text-sm text-muted-foreground flex-1 text-right">
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
