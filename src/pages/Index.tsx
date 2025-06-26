
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMetaTags } from "@/hooks/useMetaTags";
import { useIndexState } from "@/hooks/useIndexState";
import { useIndexNavigation } from "@/hooks/useIndexNavigation";
import HomePage from "./Index/HomePage";
import MarketplacePage from "./Index/MarketplacePage";
import ContactAdminDialog from "@/components/ContactAdminDialog";
import GenericContactDialog from "@/components/GenericContactDialog";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [genericContactDialogOpen, setGenericContactDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  const {
    viewMode,
    searchQuery,
    preservedFilters,
    setViewMode,
    setSearchQuery,
    setPreservedFilters,
  } = useIndexState();

  const { handleNavigateToListing } = useIndexNavigation();

  useMetaTags({
    title: "SBIR Technology Marketplace | Connect with Innovative Technologies",
    description: "Discover and connect with cutting-edge SBIR technologies. Access a curated marketplace of government-funded innovations ready for commercialization.",
    keywords: "SBIR, technology marketplace, innovation, government contracts, R&D, small business"
  });

  const handleContactAdmin = (listing: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedListing(listing);
    setContactDialogOpen(true);
  };

  const handleGenericContact = () => {
    setGenericContactDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {viewMode === 'home' ? (
        <HomePage
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onViewModeChange={setViewMode}
          onContactAdmin={handleContactAdmin}
          onGenericContact={handleGenericContact}
        />
      ) : (
        <MarketplacePage
          searchQuery={searchQuery}
          preservedFilters={preservedFilters}
          onSearchChange={setSearchQuery}
          onFiltersChange={setPreservedFilters}
          onViewModeChange={setViewMode}
          onContactAdmin={handleContactAdmin}
          onNavigateToListing={handleNavigateToListing}
        />
      )}

      {selectedListing && (
        <ContactAdminDialog
          open={contactDialogOpen}
          onOpenChange={setContactDialogOpen}
          listing={selectedListing}
        />
      )}

      <GenericContactDialog
        open={genericContactDialogOpen}
        onOpenChange={setGenericContactDialogOpen}
        title="Contact Our Team"
      />
    </div>
  );
};

export default Index;
