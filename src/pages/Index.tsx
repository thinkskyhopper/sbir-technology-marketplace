
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import { SBIRListing } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "marketplace">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [marketplaceFilters, setMarketplaceFilters] = useState({
    localSearchQuery: "",
    phaseFilter: "all",
    categoryFilter: "all", 
    statusFilter: "active"
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we should show marketplace view based on navigation state
  useEffect(() => {
    if (location.state?.showMarketplace) {
      setCurrentView("marketplace");
      // Clear the state to prevent it from persisting on future navigations
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleExploreMarketplace = () => {
    setCurrentView("marketplace");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setMarketplaceFilters(prev => ({ ...prev, localSearchQuery: query }));
    setCurrentView("marketplace");
  };

  const handlePostListingClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // TODO: Implement post listing modal/page
    console.log("Post listing clicked");
  };

  const handleContactAdmin = (listing: SBIRListing) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // TODO: Implement contact admin functionality
    console.log("Contact admin for listing:", listing);
  };

  const handleFiltersChange = (filters: typeof marketplaceFilters) => {
    setMarketplaceFilters(filters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
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
              onContactAdmin={handleContactAdmin}
              preservedFilters={marketplaceFilters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
