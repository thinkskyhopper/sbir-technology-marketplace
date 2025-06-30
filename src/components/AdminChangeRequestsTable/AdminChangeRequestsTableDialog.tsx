
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { ListingChangeRequest } from "@/types/changeRequests";
import { AdminChangeRequestsTableDialogHeader } from "./AdminChangeRequestsTableDialogHeader";
import { AdminChangeRequestsTableDialogContent } from "./AdminChangeRequestsTableDialogContent";
import { AdminChangeRequestsTableDialogActions } from "./AdminChangeRequestsTableDialogActions";
import { AdminChangeRequestsTableDialogNotesSection } from "./AdminChangeRequestsTableDialogNotesSection";
import { useAdminChangeRequestsDialogLogic } from "./useAdminChangeRequestsDialogLogic";

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
  const { 
    isProcessed 
  } = useAdminChangeRequestsDialogLogic({
    selectedRequest,
    adminNotes,
    setAdminNotes
  });

  if (!selectedRequest) return null;

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
            savingNotes={false}
            onSaveInternalNotes={async () => {}}
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
