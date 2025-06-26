
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import type { ListingChangeRequest } from "@/types/changeRequests";

interface AdminChangeRequestsTableActionsProps {
  request: ListingChangeRequest;
  processingId: string | null;
  onViewDetails: (request: ListingChangeRequest) => void;
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export const AdminChangeRequestsTableActions = ({
  request,
  processingId,
  onViewDetails,
  onApprove,
  onReject
}: AdminChangeRequestsTableActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onViewDetails(request)}
      >
        <Eye className="w-4 h-4 mr-1" />
        View
      </Button>
      {request.status === 'pending' && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onApprove(request.id)}
            disabled={processingId === request.id}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(request.id)}
            disabled={processingId === request.id}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
};
