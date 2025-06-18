
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import Footer from "@/components/Footer";
import CreateListingDialog from "@/components/CreateListingDialog";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentView = searchParams.get('view') || 'home';

  useEffect(() => {
    if (currentView === 'marketplace') {
      const marketplaceSection = document.getElementById('marketplace');
      if (marketplaceSection) {
        marketplaceSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentView]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ view: 'marketplace' });
  };

  const handleExploreClick = () => {
    setSearchParams({ view: 'marketplace' });
  };

  const handlePostListingClick = () => {
    if (user) {
      setShowCreateDialog(true);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        onSearch={handleSearch}
        onPostListingClick={handlePostListingClick}
      />
      
      <div className="flex-1">
        {currentView === 'home' && (
          <Hero onExploreClick={handleExploreClick} />
        )}
        
        <section id="marketplace" className="py-16">
          <MarketplaceGrid searchQuery={searchQuery} />
        </section>
      </div>

      <Footer />
      
      <CreateListingDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default Index;
