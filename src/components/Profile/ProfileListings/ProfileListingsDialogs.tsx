
import { useState } from "react";
import EditListingDialog from "../../EditListingDialog";
import RequestChangeDialog from "../../RequestChangeDialog";
import type { SBIRListing } from "@/types/listings";

interface ProfileListingsDialogsProps {
  selectedListing: SBIRListing | null;
}

const ProfileListingsDialogs = ({ selectedListing }: ProfileListingsDialogsProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [requestChangeDialogOpen, setRequestChangeDialogOpen] = useState(false);

  return (
    <>
      <EditListingDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        listing={selectedListing}
      />
      
      <RequestChangeDialog
        open={requestChangeDialogOpen}
        onOpenChange={setRequestChangeDialogOpen}
        listing={selectedListing}
      />
    </>
  );
};

export { ProfileListingsDialogs };
export type { ProfileListingsDialogsProps };
