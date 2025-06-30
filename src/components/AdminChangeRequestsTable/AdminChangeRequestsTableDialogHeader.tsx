
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import type { ListingChangeRequest } from "@/types/changeRequests";

interface AdminChangeRequestsTableDialogHeaderProps {
  selectedRequest: ListingChangeRequest;
}

export const AdminChangeRequestsTableDialogHeader = ({
  selectedRequest
}: AdminChangeRequestsTableDialogHeaderProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusBadgeClassName = (status: string) => {
    if (status === 'approved') {
      return 'bg-green-600 hover:bg-green-700 text-white border-transparent';
    }
    return '';
  };

  return (
    <DialogHeader>
      <DialogTitle className="flex items-center space-x-2">
        <FileText className="w-5 h-5" />
        <span>Change Request Details</span>
        <Badge 
          variant={getStatusBadgeVariant(selectedRequest.status)}
          className={getStatusBadgeClassName(selectedRequest.status)}
        >
          {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
        </Badge>
      </DialogTitle>
    </DialogHeader>
  );
};
