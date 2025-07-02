
import EditListingDialog from "@/components/EditListingDialog";
import { AdminActionDialog } from "./AdminActionDialog";
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
  onConfirmAction: (userNotes?: string, internalNotes?: string) => void;
}

const AdminListingsTableDialogs = ({
  showEditDialog,
  setShowEditDialog,
  editingListing,
  confirmAction,
  setConfirmAction,
  onConfirmAction,
}: AdminListingsTableDialogsProps) => {
  const getDialogProps = () => {
    switch (confirmAction.type) {
      case 'approve':
        return {
          title: 'Approve Listing',
          description: `Are you sure you want to approve "${confirmAction.listingTitle}"? This will make it visible to all users.`,
          confirmText: 'Approve',
          variant: 'default' as const,
        };
      case 'reject':
        return {
          title: 'Reject Listing',
          description: `Are you sure you want to reject "${confirmAction.listingTitle}"? This action will prevent the listing from being published.`,
          confirmText: 'Reject',
          variant: 'destructive' as const,
        };
      case 'hide':
        return {
          title: 'Hide Listing',
          description: `Are you sure you want to hide "${confirmAction.listingTitle}"? This will remove it from the marketplace but keep it in the database.`,
          confirmText: 'Hide',
          variant: 'default' as const,
        };
      default:
        return {
          title: '',
          description: '',
          confirmText: '',
          variant: 'default' as const,
        };
    }
  };

  const dialogProps = getDialogProps();

  return (
    <>
      <EditListingDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        listing={editingListing}
      />

      <AdminActionDialog
        open={confirmAction.show}
        onOpenChange={(open) => setConfirmAction({ ...confirmAction, show: open })}
        onConfirm={onConfirmAction}
        title={dialogProps.title}
        description={dialogProps.description}
        confirmText={dialogProps.confirmText}
        variant={dialogProps.variant}
        showNotesForm={confirmAction.type === 'approve' || confirmAction.type === 'reject'}
      />
    </>
  );
};

export default AdminListingsTableDialogs;
