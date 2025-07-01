
import type { SBIRListing } from "@/types/listings";
import EditListingDialog from "@/components/EditListingDialog";
import ContactAdminDialog from "@/components/ContactAdminDialog";
import CreateListingDialog from "@/components/CreateListingDialog";
import RequestChangeDialog from "@/components/RequestChangeDialog";

interface ListingDetailDialogsProps {
  listing: SBIRListing;
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  showContactDialog: boolean;
  setShowContactDialog: (show: boolean) => void;
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
  showRequestChangeDialog: boolean;
  setShowRequestChangeDialog: (show: boolean) => void;
  showRequestDeletionDialog: boolean;
  setShowRequestDeletionDialog: (show: boolean) => void;
}

const ListingDetailDialogs = ({
  listing,
  showEditDialog,
  setShowEditDialog,
  showContactDialog,
  setShowContactDialog,
  showCreateDialog,
  setShowCreateDialog,
  showRequestChangeDialog,
  setShowRequestChangeDialog,
  showRequestDeletionDialog,
  setShowRequestDeletionDialog
}: ListingDetailDialogsProps) => {
  return (
    <>
      <EditListingDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        listing={listing}
      />

      <ContactAdminDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        listing={listing}
      />

      <CreateListingDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <RequestChangeDialog
        open={showRequestChangeDialog}
        onOpenChange={setShowRequestChangeDialog}
        listing={listing}
      />

      <RequestChangeDialog
        open={showRequestDeletionDialog}
        onOpenChange={setShowRequestDeletionDialog}
        listing={listing}
      />
    </>
  );
};

export default ListingDetailDialogs;
