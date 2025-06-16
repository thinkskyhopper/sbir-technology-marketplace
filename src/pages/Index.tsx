
import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import { SBIRListing } from "@/components/MarketplaceCard";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "marketplace">("home");
  const [searchQuery, setSearchQuery] = useState("");

  const handleExploreMarketplace = () => {
    setCurrentView("marketplace");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView("marketplace");
  };

  const handleLoginClick = () => {
    // TODO: Implement login modal/page
    console.log("Login clicked");
  };

  const handlePostListingClick = () => {
    // TODO: Implement post listing modal/page
    console.log("Post listing clicked");
  };

  const handleListingSelect = (listing: SBIRListing) => {
    // TODO: Implement listing detail view
    console.log("Listing selected:", listing);
  };

  const handleContactAdmin = (listing: SBIRListing) => {
    // TODO: Implement contact admin functionality (requires login)
    console.log("Contact admin for listing:", listing);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
        onLoginClick={handleLoginClick}
        onPostListingClick={handlePostListingClick}
      />

      {currentView === "home" ? (
        <>
          <Hero onExploreClick={handleExploreMarketplace} />
          
          {/* Featured Section */}
          <section className="py-16 bg-secondary/20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Featured Opportunities</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover high-value SBIR contracts from leading defense agencies
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <MarketplaceGrid
                  onListingSelect={handleListingSelect}
                  onContactAdmin={handleContactAdmin}
                />
              </div>
              
              <div className="text-center mt-8">
                <button
                  onClick={handleExploreMarketplace}
                  className="text-primary hover:text-primary/80 font-semibold text-lg"
                >
                  View All Contracts →
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">SBIR Contract Marketplace</h1>
              <p className="text-muted-foreground">
                Browse and discover Phase I & II SBIR contracts from verified sellers
              </p>
            </div>
            
            <MarketplaceGrid
              searchQuery={searchQuery}
              onListingSelect={handleListingSelect}
              onContactAdmin={handleContactAdmin}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
