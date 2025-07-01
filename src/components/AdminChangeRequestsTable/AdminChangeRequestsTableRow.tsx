
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AdminChangeRequestsTableActions } from "./AdminChangeRequestsTableActions";
import type { ListingChangeRequest } from "@/types/changeRequests";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminChangeRequestsTableRowProps {
  request: ListingChangeRequest;
  processingId: string | null;
  onViewDetails: (request: ListingChangeRequest) => void;
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
  getAdminInfo: (adminId: string) => string;
}

export const AdminChangeRequestsTableRow = ({
  request,
  processingId,
  onViewDetails,
  onApprove,
  onReject,
  getAdminInfo
}: AdminChangeRequestsTableRowProps) => {
  const isMobile = useIsMobile();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'change': return 'outline';
      case 'deletion': return 'destructive';
      default: return 'secondary';
    }
  };

  // Mobile card layout
  if (isMobile) {
    return (
      <div className="border rounded-lg p-4 space-y-3 bg-card">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">
              {request.sbir_listings?.title || 'Unknown Listing'}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {request.sbir_listings?.agency || 'Unknown Agency'}
            </p>
          </div>
          <AdminChangeRequestsTableActions
            request={request}
            processingId={processingId}
            onViewDetails={onViewDetails}
            onApprove={onApprove}
            onReject={onReject}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Type:</span>
            <div className="mt-1">
              <Badge variant={getTypeBadgeVariant(request.request_type)} className="text-xs">
                {request.request_type === 'change' ? 'Change' : 'Deletion'}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>
            <div className="mt-1">
              <Badge variant={getStatusBadgeVariant(request.status)} className="text-xs">
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Requested:</span>
            <p className="font-medium">{format(new Date(request.created_at), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Processed By:</span>
            <p className="text-sm">
              {request.processed_by_admin_id ? getAdminInfo(request.processed_by_admin_id) : 'N/A'}
            </p>
          </div>
        </div>
        
        {request.user_reason && (
          <div className="pt-2 border-t">
            <span className="text-muted-foreground text-sm">Reason:</span>
            <p className="text-sm mt-1 line-clamp-2">{request.user_reason}</p>
          </div>
        )}
      </div>
    );
  }

  // Desktop table row layout
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div>
          <p className="font-medium text-sm truncate">
            {request.sbir_listings?.title || 'Unknown Listing'}
          </p>
          <p className="text-xs text-muted-foreground">
            {request.sbir_listings?.agency || 'Unknown Agency'}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getTypeBadgeVariant(request.request_type)} className="text-xs">
          {request.request_type === 'change' ? 'Change' : 'Deletion'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(request.status)} className="text-xs">
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm">{format(new Date(request.created_at), 'MMM d, yyyy')}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">
          {request.processed_by_admin_id ? getAdminInfo(request.processed_by_admin_id) : 'N/A'}
        </span>
      </TableCell>
      <TableCell>
        <AdminChangeRequestsTableActions
          request={request}
          processingId={processingId}
          onViewDetails={onViewDetails}
          onApprove={onApprove}
          onReject={onReject}
        />
      </TableCell>
    </TableRow>
  );
};
