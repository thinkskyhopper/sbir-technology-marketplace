
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User } from "lucide-react";
import type { ListingChangeRequest } from "@/types/changeRequests";
import { AdminChangeRequestsTableActions } from "./AdminChangeRequestsTableActions";

interface AdminChangeRequestsTableRowProps {
  request: ListingChangeRequest & {
    profiles?: {
      full_name?: string;
      email: string;
    };
  };
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

  const getStatusBadgeClassName = (status: string) => {
    if (status === 'approved') {
      return 'bg-green-600 hover:bg-green-700 text-white border-transparent';
    }
    return '';
  };

  const getRequestTypeBadgeClassName = (requestType: string) => {
    if (requestType === 'change') {
      return 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent';
    }
    return '';
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
      <TableCell className="min-w-[200px]">
        <div>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-sm leading-tight">{listingTitle}</p>
            {isListingDeleted && (
              <Badge variant="outline" className="text-xs text-muted-foreground flex-shrink-0">
                Deleted
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{listingAgency}</p>
        </div>
      </TableCell>
      <TableCell className="min-w-[100px]">
        <Badge 
          variant={request.request_type === 'change' ? 'default' : 'destructive'}
          className={`text-xs ${getRequestTypeBadgeClassName(request.request_type)}`}
        >
          {request.request_type === 'change' ? 'Change' : 'Deletion'}
        </Badge>
      </TableCell>
      <TableCell className="min-w-[100px]">
        <Badge 
          variant={getStatusBadgeVariant(request.status)}
          className={`text-xs ${getStatusBadgeClassName(request.status)}`}
        >
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="min-w-[120px]">
        <span className="text-sm whitespace-nowrap">
          {format(new Date(request.created_at), 'MMM d, yyyy')}
        </span>
      </TableCell>
      <TableCell className="min-w-[150px]">
        {request.profiles ? (
          <div>
            <p className="text-sm font-medium truncate">
              {request.profiles.full_name || 'Unknown User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {request.profiles.email}
            </p>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Unknown User</span>
        )}
      </TableCell>
      <TableCell className="min-w-[150px]">
        {request.processed_by ? (
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="text-sm truncate">{getAdminInfo(request.processed_by)}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Not processed</span>
        )}
      </TableCell>
      <TableCell className="min-w-[120px]">
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
