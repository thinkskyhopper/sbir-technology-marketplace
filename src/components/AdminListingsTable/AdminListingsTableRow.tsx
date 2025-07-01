
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AdminListingsTableActions from "./AdminListingsTableActions";
import { format } from "date-fns";
import { Link } from "react-router-dom";
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
      case 'Sold': return 'sold';
      default: return 'secondary';
    }
  };

  const getStatusBadgeClassName = (status: string) => {
    if (status === 'Active') {
      return 'bg-green-600 hover:bg-green-700 text-white border-transparent';
    }
    return '';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderStatusBadge = () => {
    const badge = (
      <Badge 
        variant={getStatusBadgeVariant(listing.status)} 
        className={`text-xs ${getStatusBadgeClassName(listing.status)}`}
      >
        {listing.status}
      </Badge>
    );

    // If status is "Sold" and we have a date_sold, wrap with tooltip
    if (listing.status === 'Sold' && listing.date_sold) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {badge}
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                Sold on {format(new Date(listing.date_sold), 'MMM d, yyyy')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return badge;
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="max-w-[250px]">
        <div className="flex items-start space-x-2">
          <div className="flex-1 min-w-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to={`/listing/${listing.id}`}
                    className="font-medium line-clamp-2 text-sm cursor-pointer hover:text-primary transition-colors"
                  >
                    {listing.title}
                  </Link>
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
        <p className="text-sm truncate">{listing.agency}</p>
      </TableCell>
      <TableCell>
        <Badge variant="phase" className="text-xs">{listing.phase}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-sm font-medium">{formatCurrency(listing.value)}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{format(new Date(listing.deadline), 'MMM d, yyyy')}</span>
      </TableCell>
      <TableCell>
        {renderStatusBadge()}
      </TableCell>
      <TableCell className="min-w-[180px]">
        {listing.profiles ? (
          <div>
            <Link 
              to={`/profile?userId=${listing.user_id}`}
              className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            >
              {listing.profiles.full_name || 'N/A'}
            </Link>
            <p className="text-xs text-muted-foreground">
              {listing.profiles.email}
            </p>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Unknown</span>
        )}
      </TableCell>
      <TableCell>
        <span className="text-sm">{format(new Date(listing.submitted_at), 'MMM d, yyyy')}</span>
      </TableCell>
      <TableCell className="w-16">
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
