
import { Button } from "@/components/ui/button";
import { Edit, Check, X, EyeOff, Trash2, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SBIRListing } from "@/types/listings";

interface AdminListingsTableActionsProps {
  listing: SBIRListing;
  isProcessing: boolean;
  onEdit: (listing: SBIRListing) => void;
  onApprove: (listing: SBIRListing) => void;
  onReject: (listing: SBIRListing) => void;
  onHide: (listing: SBIRListing) => void;
  onDelete: (listing: SBIRListing) => void;
}

const AdminListingsTableActions = ({
  listing,
  isProcessing,
  onEdit,
  onApprove,
  onReject,
  onHide,
  onDelete,
}: AdminListingsTableActionsProps) => {
  const navigate = useNavigate();

  const handleViewHistory = () => {
    navigate(`/listing/${listing.id}/history`);
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(listing)}
        disabled={isProcessing}
        className="h-8 w-8 p-0"
        title="Edit listing"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleViewHistory}
        className="h-8 w-8 p-0"
        title="View history"
      >
        <History className="h-4 w-4" />
      </Button>

      {listing.status === 'Pending' && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onApprove(listing)}
            disabled={isProcessing}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            title="Approve listing"
          >
            <Check className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReject(listing)}
            disabled={isProcessing}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Reject listing"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}

      {(listing.status === 'Active' || listing.status === 'Sold') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onHide(listing)}
          disabled={isProcessing}
          className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          title="Hide listing"
        >
          <EyeOff className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(listing)}
        disabled={isProcessing}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        title="Delete listing"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AdminListingsTableActions;
