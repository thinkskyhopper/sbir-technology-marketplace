
import MarketplaceGridContainer from "./MarketplaceGrid/MarketplaceGridContainer";
import type { SBIRListing } from "@/types/listings";

interface MarketplaceGridProps {
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

const MarketplaceGrid = (props: MarketplaceGridProps) => {
  return <MarketplaceGridContainer {...props} />;
};

export default MarketplaceGrid;
