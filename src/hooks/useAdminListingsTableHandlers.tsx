
import { useToast } from "@/hooks/use-toast";
import type { SBIRListing } from "@/types/listings";

interface UseAdminListingsTableHandlersProps {
  approveListing: (id: string) => Promise<void>;
  rejectListing: (id: string) => Promise<void>;
  hideListing: (id: string) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  setProcessingId: (id: string | null) => void;
  setEditingListing: (listing: SBIRListing | null) => void;
  setShowEditDialog: (show: boolean) => void;
  setConfirmAction: (action: {
    show: boolean;
    type: 'approve' | 'reject' | 'hide';
    listingId: string;
    listingTitle: string;
  }) => void;
  confirmAction: {
    show: boolean;
    type: 'approve' | 'reject' | 'hide';
    listingId: string;
    listingTitle: string;
  };
}

export const useAdminListingsTableHandlers = ({
  approveListing,
  rejectListing,
  hideListing,
  deleteListing,
  setProcessingId,
  setEditingListing,
  setShowEditDialog,
  setConfirmAction,
  confirmAction,
}: UseAdminListingsTableHandlersProps) => {
  const { toast } = useToast();

  const handleEdit = (listing: SBIRListing) => {
    setEditingListing(listing);
    setShowEditDialog(true);
  };

  const handleApproveClick = (listing: SBIRListing) => {
    setConfirmAction({
      show: true,
      type: 'approve',
      listingId: listing.id,
      listingTitle: listing.title
    });
  };

  const handleRejectClick = (listing: SBIRListing) => {
    setConfirmAction({
      show: true,
      type: 'reject',
      listingId: listing.id,
      listingTitle: listing.title
    });
  };

  const handleHideClick = (listing: SBIRListing) => {
    setConfirmAction({
      show: true,
      type: 'hide',
      listingId: listing.id,
      listingTitle: listing.title
    });
  };

  const handleDeleteClick = async (listing: SBIRListing) => {
    try {
      setProcessingId(listing.id);
      await deleteListing(listing.id);
      toast({
        title: "Listing Deleted",
        description: "The listing has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmAction = async () => {
    try {
      setProcessingId(confirmAction.listingId);
      
      if (confirmAction.type === 'approve') {
        await approveListing(confirmAction.listingId);
        toast({
          title: "Listing Approved",
          description: "The listing has been successfully approved and is now active.",
        });
      } else if (confirmAction.type === 'reject') {
        await rejectListing(confirmAction.listingId);
        toast({
          title: "Listing Rejected",
          description: "The listing has been rejected.",
        });
      } else if (confirmAction.type === 'hide') {
        await hideListing(confirmAction.listingId);
        toast({
          title: "Listing Hidden",
          description: "The listing has been hidden from the marketplace.",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${confirmAction.type} listing. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
      setConfirmAction({ show: false, type: 'approve', listingId: '', listingTitle: '' });
    }
  };

  return {
    handleEdit,
    handleApproveClick,
    handleRejectClick,
    handleHideClick,
    handleDeleteClick,
    handleConfirmAction,
  };
};
