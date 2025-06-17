
import MarketplaceCard from "./MarketplaceCard";
import type { SBIRListing } from "@/types/listings";
import { useAuth } from "@/contexts/AuthContext";

interface MarketplaceResultsGridProps {
  listings: SBIRListing[];
  onEditListing: (listing: SBIRListing) => void;
  onContactAdmin?: (listing: SBIRListing) => void;
}

const MarketplaceResultsGrid = ({ 
  listings, 
  onEditListing, 
  onContactAdmin 
}: MarketplaceResultsGridProps) => {
  const { isAdmin } = useAuth();

  return (
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
  );
};

export default MarketplaceResultsGrid;
