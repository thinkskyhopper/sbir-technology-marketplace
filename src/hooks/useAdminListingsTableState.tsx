
import { useState } from "react";
import type { SBIRListing } from "@/types/listings";

export const useAdminListingsTableState = () => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<SBIRListing | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean;
    type: 'approve' | 'reject' | 'hide';
    listingId: string;
    listingTitle: string;
  }>({
    show: false,
    type: 'approve',
    listingId: '',
    listingTitle: ''
  });

  return {
    processingId,
    setProcessingId,
    editingListing,
    setEditingListing,
    showEditDialog,
    setShowEditDialog,
    confirmAction,
    setConfirmAction,
  };
};
