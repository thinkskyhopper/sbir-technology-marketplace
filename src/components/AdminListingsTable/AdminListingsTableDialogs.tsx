
import EditListingDialog from "@/components/EditListingDialog";
import ConfirmActionDialog from "@/components/ConfirmActionDialog";
import type { SBIRListing } from "@/types/listings";

interface AdminListingsTableDialogsProps {
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  editingListing: SBIRListing | null;
  confirmAction: {
    show: boolean;
    type: 'approve' | 'reject' | 'hide';
    listingId: string;
    listingTitle: string;
  };
  setConfirmAction: (action: {
    show: boolean;
    type: 'approve' | 'reject' | 'hide';
    listingId: string;
    listingTitle: string;
  }) => void;
  onConfirmAction: () => void;
}

const AdminListingsTableDialogs = ({
  showEditDialog,
  setShowEditDialog,
  editingListing,
  confirmAction,
  setConfirmAction,
  onConfirmAction,
}: AdminListingsTableDialogsProps) => {
  return (
    <>
      <EditListingDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        listing={editingListing}
      />

      <ConfirmActionDialog
        open={confirmAction.show}
        onOpenChange={(open) => setConfirmAction({ ...confirmAction, show: open })}
        onConfirm={onConfirmAction}
        title={
          confirmAction.type === 'approve' ? 'Approve Listing' :
          confirmAction.type === 'reject' ? 'Reject Listing' : 'Hide Listing'
        }
        description={
          confirmAction.type === 'approve'
            ? `Are you sure you want to approve "${confirmAction.listingTitle}"? This will make it visible to all users.`
            : confirmAction.type === 'reject'
            ? `Are you sure you want to reject "${confirmAction.listingTitle}"? This action cannot be undone.`
            : `Are you sure you want to hide "${confirmAction.listingTitle}"? This will remove it from the marketplace but keep it in the database.`
        }
        confirmText={
          confirmAction.type === 'approve' ? 'Approve' :
          confirmAction.type === 'reject' ? 'Reject' : 'Hide'
        }
        variant={confirmAction.type === 'reject' ? 'destructive' : 'default'}
      />
    </>
  );
};

export default AdminListingsTableDialogs;
