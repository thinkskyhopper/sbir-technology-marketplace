
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import type { BaseActionProps } from "./types";
import type { SBIRListing } from "@/types/listings";

interface DeleteActionProps extends BaseActionProps {
  onDelete: (listing: SBIRListing) => void;
}

const DeleteAction = ({ listing, isProcessing, onDelete }: DeleteActionProps) => {
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        onClick={() => onDelete(listing)} 
        disabled={isProcessing}
        className="text-red-600 focus:text-red-700"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete listing
      </DropdownMenuItem>
    </>
  );
};

export default DeleteAction;
