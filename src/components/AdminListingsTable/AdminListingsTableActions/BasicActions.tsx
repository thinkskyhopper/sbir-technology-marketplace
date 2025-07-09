
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Edit, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BaseActionProps } from "./types";
import type { SBIRListing } from "@/types/listings";

interface BasicActionsProps extends BaseActionProps {
  onEdit: (listing: SBIRListing) => void;
}

const BasicActions = ({ listing, isProcessing, onEdit }: BasicActionsProps) => {
  const navigate = useNavigate();

  const handleViewHistory = () => {
    navigate(`/listing/${listing.id}/history`);
  };

  return (
    <>
      <DropdownMenuItem onClick={() => onEdit(listing)} disabled={isProcessing}>
        <Edit className="mr-2 h-4 w-4" />
        Edit listing
      </DropdownMenuItem>

      <DropdownMenuItem onClick={handleViewHistory}>
        <History className="mr-2 h-4 w-4" />
        View history
      </DropdownMenuItem>
    </>
  );
};

export default BasicActions;
