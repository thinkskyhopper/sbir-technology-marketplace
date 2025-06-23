
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, X, Eye, Edit } from "lucide-react";
import type { SBIRListing } from "@/types/listings";

interface AdminListingsTableActionsProps {
  listing: SBIRListing;
  processingId: string | null;
  onEdit: (listing: SBIRListing) => void;
  onApprove: (listing: SBIRListing) => void;
  onReject: (listing: SBIRListing) => void;
  onHide: (listing: SBIRListing) => void;
}

const AdminListingsTableActions = ({
  listing,
  processingId,
  onEdit,
  onApprove,
  onReject,
  onHide,
}: AdminListingsTableActionsProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(listing)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit listing details</p>
          </TooltipContent>
        </Tooltip>
        
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
          onClick={() => onHide(listing)}
          disabled={processingId === listing.id}
          className="text-gray-600 hover:text-gray-700"
          title={listing.status === 'Hidden' ? 'Already hidden' : 'Hide listing'}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </TooltipProvider>
  );
};

export default AdminListingsTableActions;
