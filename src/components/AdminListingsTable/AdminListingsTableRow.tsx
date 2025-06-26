
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AdminListingsTableActions from "./AdminListingsTableActions";
import { format } from "date-fns";
import type { SBIRListing } from "@/types/listings";
import { useListingChangeRequests } from "@/hooks/useListingChangeRequests";
import { AlertTriangle } from "lucide-react";

interface AdminListingsTableRowProps {
  listing: SBIRListing;
  processingId: string | null;
  onEdit: (listing: SBIRListing) => void;
  onApprove: (listing: SBIRListing) => void;
  onReject: (listing: SBIRListing) => void;
  onHide: (listing: SBIRListing) => void;
  onDelete: (listing: SBIRListing) => void;
}

const AdminListingsTableRow = ({
  listing,
  processingId,
  onEdit,
  onApprove,
  onReject,
  onHide,
  onDelete,
}: AdminListingsTableRowProps) => {
  const { getListingRequestSummary } = useListingChangeRequests();
  const requestSummary = getListingRequestSummary(listing.id);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      case 'Hidden': return 'outline';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="max-w-[250px]">
        <div className="flex items-start space-x-2">
          <div className="flex-1 min-w-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="font-medium line-clamp-2 text-sm cursor-help">{listing.title}</p>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{listing.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground truncate">{listing.category}</p>
          </div>
          {requestSummary && requestSummary.total_pending > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium">Pending Requests:</p>
                    {requestSummary.pending_changes > 0 && (
                      <p>{requestSummary.pending_changes} change request(s)</p>
                    )}
                    {requestSummary.pending_deletions > 0 && (
                      <p>{requestSummary.pending_deletions} deletion request(s)</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
      <TableCell className="max-w-[120px]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm truncate cursor-help">{listing.agency}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{listing.agency}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">{listing.phase}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-sm font-medium">{formatCurrency(listing.value)}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{format(new Date(listing.deadline), 'MMM d, yyyy')}</span>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(listing.status)} className="text-xs">
          {listing.status}
        </Badge>
      </TableCell>
      <TableCell className="max-w-[140px]">
        {listing.profiles ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <p className="text-sm font-medium truncate">
                    {listing.profiles.full_name || 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {listing.profiles.email}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-medium">{listing.profiles.full_name || 'N/A'}</p>
                  <p>{listing.profiles.email}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-sm text-muted-foreground">Unknown</span>
        )}
      </TableCell>
      <TableCell>
        <span className="text-sm">{format(new Date(listing.submitted_at), 'MMM d, yyyy')}</span>
      </TableCell>
      <TableCell>
        <AdminListingsTableActions
          listing={listing}
          processingId={processingId}
          onEdit={onEdit}
          onApprove={onApprove}
          onReject={onReject}
          onHide={onHide}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default AdminListingsTableRow;
