
import { Button } from "@/components/ui/button";
import { Check, X, Eye, Edit } from "lucide-react";
import type { SBIRListing } from "@/types/listings";

interface AdminListingsTableActionsProps {
  listing: SBIRListing;
  processingId: string | null;
  onEdit: (listing: SBIRListing) => void;
  onApprove: (listing: SBIRListing) => void;
  onReject: (listing: SBIRListing) => void;
}

const AdminListingsTableActions = ({
  listing,
  processingId,
  onEdit,
  onApprove,
  onReject,
}: AdminListingsTableActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onEdit(listing)}
        className="text-blue-600 hover:text-blue-700"
      >
        <Edit className="w-4 h-4" />
      </Button>
      
      {listing.status === 'Pending' && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onApprove(listing)}
            disabled={processingId === listing.id}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(listing)}
            disabled={processingId === listing.id}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </>
      )}
      
      <Button
        size="sm"
        variant="ghost"
        className="text-blue-600 hover:text-blue-700"
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default AdminListingsTableActions;
