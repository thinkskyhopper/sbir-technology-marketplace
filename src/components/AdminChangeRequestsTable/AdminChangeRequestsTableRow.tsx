
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User } from "lucide-react";
import type { ListingChangeRequest } from "@/types/changeRequests";
import { AdminChangeRequestsTableActions } from "./AdminChangeRequestsTableActions";

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
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  // Use preserved listing information if available, otherwise fall back to joined data
  const listingTitle = request.listing_title || 
                      (request as any).sbir_listings?.title || 
                      'Deleted Listing';
  
  const listingAgency = request.listing_agency || 
                       (request as any).sbir_listings?.agency || 
                       'Unknown Agency';

  const isListingDeleted = !request.listing_id;

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="flex items-center space-x-2">
            <p className="font-medium">{listingTitle}</p>
            {isListingDeleted && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Deleted
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{listingAgency}</p>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={request.request_type === 'change' ? 'default' : 'destructive'}>
          {request.request_type === 'change' ? 'Change' : 'Deletion'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(request.status)}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        {format(new Date(request.created_at), 'MMM d, yyyy')}
      </TableCell>
      <TableCell>
        {request.processed_by ? (
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span className="text-sm">{getAdminInfo(request.processed_by)}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Not processed</span>
        )}
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
