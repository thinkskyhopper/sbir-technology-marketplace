
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceGrid from "@/components/MarketplaceGrid";
import SignInPromptCard from "@/components/SignInPromptCard";
import type { SBIRListing } from "@/types/listings";
import { useMetaTags } from "@/hooks/useMetaTags";
import { useAuth } from "@/contexts/AuthContext";

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
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useMetaTags({
    title: 'SBIR Technology Marketplace - Browse Available Technologies',
    description: 'Browse and discover Phase I & II SBIR technology from verified sellers in our comprehensive marketplace.',
  });

  return (
    <section className="py-8" aria-labelledby="marketplace-heading">
      <div className="container mx-auto px-6">
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 id="marketplace-heading" className="text-3xl font-bold mb-2">SBIR Technology Marketplace</h1>
              <p className="text-muted-foreground">Browse and discover Phase I & II SBIR technology from verified sellers</p>
            </div>
            {!user && (
              <div className="flex-shrink-0 w-full sm:w-[500px]">
                <SignInPromptCard onSignIn={() => navigate('/auth')} />
              </div>
            )}
          </div>
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
