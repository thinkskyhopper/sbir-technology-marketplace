
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { ListingChangeRequest } from "@/types/changeRequests";

interface AdminChangeRequestsTableDialogActionsProps {
  selectedRequest: ListingChangeRequest;
  processingId: string | null;
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export const AdminChangeRequestsTableDialogActions = ({
  selectedRequest,
  processingId,
  onApprove,
  onReject
}: AdminChangeRequestsTableDialogActionsProps) => {
  // Only show actions for pending requests
  if (selectedRequest.status !== 'pending') {
    return null;
  }

  return (
    <div className="flex justify-end space-x-4 pt-4 border-t">
      <Button
        variant="outline"
        onClick={() => onReject(selectedRequest.id)}
        disabled={processingId === selectedRequest.id}
        className="text-red-600 hover:text-red-700"
      >
        <X className="w-4 h-4 mr-2" />
        Reject Request
      </Button>
      <Button
        onClick={() => onApprove(selectedRequest.id)}
        disabled={processingId === selectedRequest.id}
        className="bg-green-600 hover:bg-green-700"
      >
        <Check className="w-4 h-4 mr-2" />
        Approve Request
      </Button>
    </div>
  );
};
