
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Eye } from "lucide-react";

interface ListingHistoryHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  onViewListing: () => void;
}

export const ListingHistoryHeader = ({ onBack, onEdit, onViewListing }: ListingHistoryHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Listings</span>
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
          className="flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>View Listing</span>
        </Button>
        <Button
          onClick={onEdit}
          className="flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Listing</span>
        </Button>
      </div>
    </div>
  );
};
