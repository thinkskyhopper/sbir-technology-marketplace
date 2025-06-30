
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useChangeRequests } from "@/hooks/useChangeRequests";
import type { ListingChangeRequest } from "@/types/changeRequests";
import { AdminChangeRequestsTableDialogHeader } from "./AdminChangeRequestsTableDialogHeader";
import { AdminChangeRequestsTableDialogContent } from "./AdminChangeRequestsTableDialogContent";
import { AdminChangeRequestsTableDialogActions } from "./AdminChangeRequestsTableDialogActions";
import { AdminChangeRequestsTableDialogNotesSection } from "./AdminChangeRequestsTableDialogNotesSection";

interface AdminChangeRequestsTableDialogProps {
  selectedRequest: ListingChangeRequest | null;
  showDetailsDialog: boolean;
  setShowDetailsDialog: (show: boolean) => void;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  adminNotesForUser: string;
  setAdminNotesForUser: (notes: string) => void;
  processingId: string | null;
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
  getAdminInfo: (adminId: string) => string;
}

export const AdminChangeRequestsTableDialog = ({
  selectedRequest,
  showDetailsDialog,
  setShowDetailsDialog,
  adminNotes,
  setAdminNotes,
  adminNotesForUser,
  setAdminNotesForUser,
  processingId,
  onApprove,
  onReject,
  getAdminInfo
}: AdminChangeRequestsTableDialogProps) => {
  const [savingNotes, setSavingNotes] = useState(false);
  const { updateChangeRequestStatus } = useChangeRequests();
  const { toast } = useToast();

  if (!selectedRequest) return null;

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

  const isProcessed = selectedRequest.status !== 'pending';

  return (
    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AdminChangeRequestsTableDialogHeader selectedRequest={selectedRequest} />
        
        <div className="space-y-6">
          <AdminChangeRequestsTableDialogContent 
            selectedRequest={selectedRequest}
            getAdminInfo={getAdminInfo}
          />

          <AdminChangeRequestsTableDialogNotesSection
            selectedRequest={selectedRequest}
            adminNotes={adminNotes}
            setAdminNotes={setAdminNotes}
            adminNotesForUser={adminNotesForUser}
            setAdminNotesForUser={setAdminNotesForUser}
            savingNotes={savingNotes}
            onSaveInternalNotes={handleSaveInternalNotes}
            isProcessed={isProcessed}
          />

          <AdminChangeRequestsTableDialogActions
            selectedRequest={selectedRequest}
            processingId={processingId}
            onApprove={onApprove}
            onReject={onReject}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
