
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { EyeOff } from "lucide-react";
import type { BaseActionProps } from "./types";
import type { SBIRListing } from "@/types/listings";

interface HideActionProps extends BaseActionProps {
  onHide: (listing: SBIRListing) => void;
}

const HideAction = ({ listing, isProcessing, onHide }: HideActionProps) => {
  if (listing.status !== 'Active' && listing.status !== 'Sold') {
    return null;
  }

  return (
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
  );
};

export default HideAction;
