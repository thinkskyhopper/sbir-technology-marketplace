
import React from 'react';
import Hero from "@/components/Hero";
import HomepageFeaturedGrid from "@/components/HomepageFeaturedGrid";
import type { SBIRListing } from "@/types/listings";
import { useMetaTags } from "@/hooks/useMetaTags";

interface HomePageProps {
  onExploreClick: () => void;
  onContactAdmin: (listing: SBIRListing) => void;
  onEditListing?: (listing: SBIRListing) => void;
}

const HomePage = ({ onExploreClick, onContactAdmin, onEditListing }: HomePageProps) => {
  useMetaTags({
    title: 'The SBIR Tech Marketplace - Connect SBIR Winners with Buyers',
    description: 'Helping generate revenue from past SBIR/STTR awards by connecting interested buyers, teaming partners and federal customers.',
  });

  return (
    <>
      <Hero onExploreClick={onExploreClick} />
      
      {/* Featured Section */}
      <section className="py-16 bg-secondary/20" aria-labelledby="featured-heading">
        <div className="container mx-auto px-6">
          <header className="text-center mb-12">
            <h2 id="featured-heading" className="text-3xl font-bold mb-4">Featured Opportunities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover high-value SBIR technology from leading defense industry partners</p>
          </header>
          
          <div className="max-w-6xl mx-auto">
            <HomepageFeaturedGrid 
              onContactAdmin={onContactAdmin}
              onEditListing={onEditListing}
            />
          </div>
          
          <div className="text-center mt-8">
            <button 
              onClick={onExploreClick} 
              className="text-primary hover:text-primary/80 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              aria-label="View all SBIR opportunities in marketplace"
            >
              View All Opportunities →
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
