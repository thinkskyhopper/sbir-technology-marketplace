
import React from 'react';
import MarketplaceGrid from "@/components/MarketplaceGrid";
import type { SBIRListing } from "@/types/listings";
import { useMetaTags } from "@/hooks/useMetaTags";

interface MarketplacePageProps {
  searchQuery: string;
  onContactAdmin: (listing: SBIRListing) => void;
  marketplaceFilters: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
    sortFilter: string;
  };
  onFiltersChange: (filters: any) => void;
}

const MarketplacePage = ({ 
  searchQuery, 
  onContactAdmin, 
  marketplaceFilters, 
  onFiltersChange 
}: MarketplacePageProps) => {
  useMetaTags({
    title: 'SBIR Technology Marketplace - Browse Available Technologies',
    description: 'Browse and discover Phase I & II SBIR technology from verified sellers in our comprehensive marketplace.',
  });

  return (
    <section className="py-8" aria-labelledby="marketplace-heading">
      <div className="container mx-auto px-6">
        <header className="mb-8">
          <h1 id="marketplace-heading" className="text-3xl font-bold mb-2">SBIR Technology Marketplace</h1>
          <p className="text-muted-foreground">Browse and discover Phase I & II SBIR technology from verified sellers</p>
        </header>
        
        <MarketplaceGrid 
          searchQuery={searchQuery} 
          onContactAdmin={onContactAdmin} 
          preservedFilters={marketplaceFilters} 
          onFiltersChange={onFiltersChange}
          showFilters={true}
        />
      </div>
    </section>
  );
};

export default MarketplacePage;
