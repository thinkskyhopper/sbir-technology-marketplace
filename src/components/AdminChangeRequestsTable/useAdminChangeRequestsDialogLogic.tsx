
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useChangeRequests } from "@/hooks/useChangeRequests";
import type { ListingChangeRequest } from "@/types/changeRequests";

interface UseAdminChangeRequestsDialogLogicProps {
  selectedRequest: ListingChangeRequest | null;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
}

export const useAdminChangeRequestsDialogLogic = ({
  selectedRequest,
  adminNotes,
  setAdminNotes
}: UseAdminChangeRequestsDialogLogicProps) => {
  const [savingNotes, setSavingNotes] = useState(false);
  const { updateChangeRequestStatus } = useChangeRequests();
  const { toast } = useToast();

  const handleSaveInternalNotes = async () => {
    if (!selectedRequest || !adminNotes.trim()) return;

    try {
      setSavingNotes(true);
      await updateChangeRequestStatus(
        selectedRequest.id, 
        selectedRequest.status as 'approved' | 'rejected', 
        adminNotes
      );
      
      toast({
        title: "Notes Saved",
        description: "Internal admin notes have been updated successfully.",
      });
      
      selectedRequest.admin_notes = adminNotes;
      setAdminNotes("");
    } catch (error) {
      console.error('Error saving internal notes:', error);
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const isProcessed = selectedRequest?.status !== 'pending';

  return {
    savingNotes,
    handleSaveInternalNotes,
    isProcessed
  };
};
