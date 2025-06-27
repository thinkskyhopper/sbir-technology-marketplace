
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import MarketplaceCard from './MarketplaceCard';
import MarketplaceLoading from './MarketplaceLoading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useFeaturedListings } from '@/hooks/useFeaturedListings';
import { useAuth } from '@/contexts/AuthContext';
import FeaturedListingsManagementDialog from './HomepageFeaturedGrid/FeaturedListingsManagementDialog';
import type { SBIRListing } from '@/types/listings';

interface HomepageFeaturedGridProps {
  onContactAdmin?: (listing: SBIRListing) => void;
  onEditListing?: (listing: SBIRListing) => void;
}

const HomepageFeaturedGrid = ({ onContactAdmin, onEditListing }: HomepageFeaturedGridProps) => {
  const [listings, setListings] = useState<SBIRListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showManagementDialog, setShowManagementDialog] = useState(false);
  const { getHomepageListings } = useFeaturedListings();
  const { isAdmin } = useAuth();

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const homepageListings = await getHomepageListings();
      setListings(homepageListings);
    } catch (err) {
      console.error('❌ Error fetching homepage listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [getHomepageListings]);

  const handleManagementUpdate = () => {
    fetchListings(); // Refresh the listings after management changes
  };

  if (loading) {
    return <MarketplaceLoading />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading featured listings: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No featured listings available at this time.</p>
        {isAdmin && (
          <Button onClick={() => setShowManagementDialog(true)} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Manage Featured Listings
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <MarketplaceCard
            key={listing.id}
            listing={listing}
            onEdit={isAdmin ? onEditListing : undefined}
            onContact={onContactAdmin}
          />
        ))}
      </div>
      
      {isAdmin && (
        <div className="mt-8 text-center">
          <Button onClick={() => setShowManagementDialog(true)} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Manage Featured Listings
          </Button>
        </div>
      )}

      <FeaturedListingsManagementDialog
        open={showManagementDialog}
        onOpenChange={setShowManagementDialog}
        onUpdate={handleManagementUpdate}
      />
    </div>
  );
};

export default HomepageFeaturedGrid;
