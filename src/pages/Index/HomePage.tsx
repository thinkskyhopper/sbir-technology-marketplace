
import React from 'react';
import Hero from "@/components/Hero";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import type { SBIRListing } from "@/types/listings";

interface HomePageProps {
  onExploreClick: () => void;
  onContactAdmin: (listing: SBIRListing) => void;
}

const HomePage = ({ onExploreClick, onContactAdmin }: HomePageProps) => {
  return (
    <>
      <Hero onExploreClick={onExploreClick} />
      
      {/* Featured Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Opportunities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover high-value SBIR technology from leading defense industry partners</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <MarketplaceGrid 
              onContactAdmin={onContactAdmin} 
              showFilters={false} 
              maxListings={6} 
              showPaginationInfo={false}
            />
          </div>
          
          <div className="text-center mt-8">
            <button onClick={onExploreClick} className="text-primary hover:text-primary/80 font-semibold text-lg">
              View All Opportunities →
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
