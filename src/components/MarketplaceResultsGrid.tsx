
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
      {/* Results info and Top Pagination - inline */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <span>
            Showing {startItem}-{endItem} of {totalItems} listings
          </span>
          <span className="ml-4">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <MarketplacePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
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
