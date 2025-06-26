
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
    <TableRow>
      <TableCell>
        <div className="flex items-start space-x-2">
          <div className="flex-1">
            <p className="font-medium line-clamp-2">{listing.title}</p>
            <p className="text-sm text-muted-foreground">{listing.agency}</p>
          </div>
          {requestSummary && requestSummary.total_pending > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
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
      <TableCell>
        <Badge variant={getStatusBadgeVariant(listing.status)}>
          {listing.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{listing.phase}</Badge>
      </TableCell>
      <TableCell>{listing.category}</TableCell>
      <TableCell>{formatCurrency(listing.value)}</TableCell>
      <TableCell>{format(new Date(listing.submitted_at), 'MMM d, yyyy')}</TableCell>
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
