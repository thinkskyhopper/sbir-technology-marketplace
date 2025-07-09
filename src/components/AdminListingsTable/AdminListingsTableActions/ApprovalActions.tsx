
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Check, X } from "lucide-react";
import type { BaseActionProps } from "./types";
import type { SBIRListing } from "@/types/listings";

interface ApprovalActionsProps extends BaseActionProps {
  onApprove: (listing: SBIRListing) => void;
  onReject: (listing: SBIRListing) => void;
}

const ApprovalActions = ({ listing, isProcessing, onApprove, onReject }: ApprovalActionsProps) => {
  if (listing.status !== 'Pending') {
    return null;
  }

  return (
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
  );
};

export default ApprovalActions;
