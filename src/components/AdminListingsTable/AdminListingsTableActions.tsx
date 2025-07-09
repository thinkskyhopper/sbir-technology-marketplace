
import { Button } from "@/components/ui/button";
import { Edit, Check, X, EyeOff, Trash2, History, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SBIRListing } from "@/types/listings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isProcessing}
          className="h-8 w-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEdit(listing)} disabled={isProcessing}>
          <Edit className="mr-2 h-4 w-4" />
          Edit listing
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleViewHistory}>
          <History className="mr-2 h-4 w-4" />
          View history
        </DropdownMenuItem>

        {listing.status === 'Pending' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onApprove(listing)} 
              disabled={isProcessing}
              className="text-green-600 focus:text-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Approve listing
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => onReject(listing)} 
              disabled={isProcessing}
              className="text-red-600 focus:text-red-700"
            >
              <X className="mr-2 h-4 w-4" />
              Reject listing
            </DropdownMenuItem>
          </>
        )}

        {(listing.status === 'Active' || listing.status === 'Sold') && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onHide(listing)} 
              disabled={isProcessing}
              className="text-orange-600 focus:text-orange-700"
            >
              <EyeOff className="mr-2 h-4 w-4" />
              Hide listing
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(listing)} 
          disabled={isProcessing}
          className="text-red-600 focus:text-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete listing
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminListingsTableActions;
