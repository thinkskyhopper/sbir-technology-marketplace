
import MarketplaceCard from "./MarketplaceCard";
import MarketplaceLoading from "./MarketplaceLoading";
import MarketplaceNoResults from "./MarketplaceNoResults";
import type { SBIRListing } from "@/types/listings";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import EditListingDialog from "./EditListingDialog";
import ContactAdminDialog from "./ContactAdminDialog";

interface MarketplaceResultsGridProps {
  listings: SBIRListing[];
  loading: boolean;
  error: string | null;
}

const MarketplaceResultsGrid = ({ 
  listings, 
  loading,
  error
}: MarketplaceResultsGridProps) => {
  const { isAdmin } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SBIRListing | null>(null);

  const handleEditListing = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setShowEditDialog(true);
  };

  const handleContactAdmin = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setShowContactDialog(true);
  };

  if (loading) {
    return <MarketplaceLoading />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return <MarketplaceNoResults />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <MarketplaceCard
            key={listing.id}
            listing={listing}
            onEdit={isAdmin ? () => handleEditListing(listing) : undefined}
            onContact={() => handleContactAdmin(listing)}
          />
        ))}
      </div>

      {/* Edit Dialog */}
      {selectedListing && (
        <EditListingDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          listing={selectedListing}
        />
      )}

      {/* Contact Dialog */}
      {selectedListing && (
        <ContactAdminDialog
          open={showContactDialog}
          onOpenChange={setShowContactDialog}
          listing={selectedListing}
        />
      )}
    </>
  );
};

export default MarketplaceResultsGrid;
