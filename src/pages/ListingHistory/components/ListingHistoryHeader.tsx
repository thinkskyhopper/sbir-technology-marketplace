
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ListingHistoryHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  onViewListing: () => void;
}

export const ListingHistoryHeader = ({ onBack, onEdit, onViewListing }: ListingHistoryHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          size={isMobile ? "icon" : "default"}
          className={isMobile ? "" : "flex items-center space-x-2"}
          title="Back to Listings"
        >
          <ArrowLeft className="w-4 h-4" />
          {!isMobile && <span>Back to Listings</span>}
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Listing History</h1>
          <p className="text-muted-foreground">Complete history and details</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={onViewListing}
          size={isMobile ? "icon" : "default"}
          className={isMobile ? "" : "flex items-center space-x-2"}
          title="View Listing"
        >
          <Eye className="w-4 h-4" />
          {!isMobile && <span>View Listing</span>}
        </Button>
        <Button
          onClick={onEdit}
          size={isMobile ? "icon" : "default"}
          className={isMobile ? "" : "flex items-center space-x-2"}
          title="Edit Listing"
        >
          <Edit className="w-4 h-4" />
          {!isMobile && <span>Edit Listing</span>}
        </Button>
      </div>
    </div>
  );
};
