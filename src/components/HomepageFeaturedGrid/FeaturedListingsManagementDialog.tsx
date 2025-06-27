
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useFeaturedListings } from '@/hooks/useFeaturedListings';
import { useListings } from '@/hooks/useListings';
import FeaturedListingsSelector from './FeaturedListingsSelector';
import FeaturedListingsArrangement from './FeaturedListingsArrangement';
import type { SBIRListing } from '@/types/listings';

interface FeaturedListingsManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const FeaturedListingsManagementDialog = ({
  open,
  onOpenChange,
  onUpdate
}: FeaturedListingsManagementDialogProps) => {
  const [selectedListings, setSelectedListings] = useState<SBIRListing[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const { 
    getFeaturedListings, 
    addFeaturedListing, 
    removeFeaturedListing, 
    updateDisplayOrder 
  } = useFeaturedListings();
  
  const { listings } = useListings();

  // Load current featured listings when dialog opens
  useEffect(() => {
    if (open) {
      loadFeaturedListings();
    }
  }, [open]);

  const loadFeaturedListings = async () => {
    try {
      setLoading(true);
      const featured = await getFeaturedListings();
      setSelectedListings(featured);
    } catch (error) {
      console.error('Error loading featured listings:', error);
      toast({
        title: "Error",
        description: "Failed to load featured listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Get current featured listings to compare
      const currentFeatured = await getFeaturedListings();
      const currentIds = currentFeatured.map(l => l.id);
      const newIds = selectedListings.map(l => l.id);
      
      // Remove listings that are no longer selected
      for (const id of currentIds) {
        if (!newIds.includes(id)) {
          await removeFeaturedListing(id);
        }
      }
      
      // Add new listings and update display orders
      for (let i = 0; i < selectedListings.length; i++) {
        const listing = selectedListings[i];
        if (!currentIds.includes(listing.id)) {
          await addFeaturedListing(listing.id, i + 1);
        } else {
          await updateDisplayOrder(listing.id, i + 1);
        }
      }
      
      toast({
        title: "Success",
        description: "Featured listings updated successfully",
      });
      
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving featured listings:', error);
      toast({
        title: "Error",
        description: "Failed to update featured listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Manage Featured Listings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="arrange" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="arrange">Arrange Selected</TabsTrigger>
            <TabsTrigger value="select">Select Listings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="arrange" className="flex-1 overflow-hidden">
            <FeaturedListingsArrangement
              selectedListings={selectedListings}
              onReorder={setSelectedListings}
            />
          </TabsContent>
          
          <TabsContent value="select" className="flex-1 overflow-hidden">
            <FeaturedListingsSelector
              listings={listings.filter(l => l.status === 'Active')}
              selectedListings={selectedListings}
              onSelectionChange={setSelectedListings}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeaturedListingsManagementDialog;
