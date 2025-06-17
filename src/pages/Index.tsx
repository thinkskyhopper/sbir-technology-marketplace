
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import { SBIRListing } from "@/hooks/useListings";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current view based on URL parameters or navigation state
  const getCurrentView = (): "home" | "marketplace" => {
    if (location.state?.showMarketplace || searchParams.get("view") === "marketplace") {
      return "marketplace";
    }
    return "home";
  };

  const [currentView, setCurrentView] = useState<"home" | "marketplace">(getCurrentView());

  // Read filters from URL parameters
  const getFiltersFromURL = () => ({
    localSearchQuery: searchParams.get("search") || "",
    phaseFilter: searchParams.get("phase") || "all",
    categoryFilter: searchParams.get("category") || "all",
    statusFilter: searchParams.get("status") || "active"
  });

  const [marketplaceFilters, setMarketplaceFilters] = useState(getFiltersFromURL());

  // Update filters when URL parameters change
  useEffect(() => {
    setMarketplaceFilters(getFiltersFromURL());
  }, [searchParams]);

  // Update view when URL or navigation state changes
  useEffect(() => {
    const newView = getCurrentView();
    setCurrentView(newView);
    
    // Clear navigation state if it exists, but don't replace if we're already showing marketplace
    if (location.state?.showMarketplace && newView === "marketplace") {
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }
  }, [location.state, searchParams, navigate, location.pathname, location.search]);

  const handleExploreMarketplace = () => {
    console.log("Explore marketplace clicked");
    setCurrentView("marketplace");
    // Update URL to include marketplace view
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("view", "marketplace");
    setSearchParams(newSearchParams);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView("marketplace");
    
    // Update URL with search query and marketplace view
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("view", "marketplace");
    newSearchParams.set("search", query);
    setSearchParams(newSearchParams);
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
    
    // Update URL parameters with new filters
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("view", "marketplace");
    if (filters.localSearchQuery) newSearchParams.set("search", filters.localSearchQuery);
    if (filters.phaseFilter !== "all") newSearchParams.set("phase", filters.phaseFilter);
    if (filters.categoryFilter !== "all") newSearchParams.set("category", filters.categoryFilter);
    if (filters.statusFilter !== "active") newSearchParams.set("status", filters.statusFilter);
    
    setSearchParams(newSearchParams);
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
