
import { useState } from "react";
import EditListingDialog from "../../EditListingDialog";
import RequestChangeDialog from "../../RequestChangeDialog";
import type { SBIRListing } from "@/types/listings";

interface ProfileListingsDialogManagerProps {
  selectedListing: SBIRListing | null;
  editDialogOpen: boolean;
  requestChangeDialogOpen: boolean;
  onEditDialogOpenChange: (open: boolean) => void;
  onRequestChangeDialogOpenChange: (open: boolean) => void;
}

const ProfileListingsDialogManager = ({
  selectedListing,
  editDialogOpen,
  requestChangeDialogOpen,
  onEditDialogOpenChange,
  onRequestChangeDialogOpenChange
}: ProfileListingsDialogManagerProps) => {
  return (
    <>
      <EditListingDialog
        open={editDialogOpen}
        onOpenChange={onEditDialogOpenChange}
        listing={selectedListing}
      />
      
      <RequestChangeDialog
        open={requestChangeDialogOpen}
        onOpenChange={onRequestChangeDialogOpenChange}
        listing={selectedListing}
      />
    </>
  );
};

export default ProfileListingsDialogManager;
