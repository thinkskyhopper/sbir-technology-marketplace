
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import AdminListingsTableActions from "./AdminListingsTableActions";
import type { SBIRListing } from "@/types/listings";

interface AdminListingsTableRowProps {
  listing: SBIRListing;
  processingId: string | null;
  onEdit: (listing: SBIRListing) => void;
  onApprove: (listing: SBIRListing) => void;
  onReject: (listing: SBIRListing) => void;
  onHide: (listing: SBIRListing) => void;
}

const AdminListingsTableRow = ({
  listing,
  processingId,
  onEdit,
  onApprove,
  onReject,
  onHide,
}: AdminListingsTableRowProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      case 'Sold':
        return 'outline';
      case 'Hidden':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <TableRow>
      <TableCell className="max-w-[200px] min-w-[150px]">
        <div>
          <Link 
            to={`/listing/${listing.id}`}
            className="font-medium break-words hover:text-blue-600 hover:underline transition-colors"
          >
            {listing.title}
          </Link>
          <div className="text-sm text-muted-foreground truncate">
            {listing.category}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm max-w-[100px] min-w-[80px]">
        <div className="break-words">{listing.agency}</div>
      </TableCell>
      <TableCell className="min-w-[90px]">
        <Badge variant={listing.phase === "Phase I" ? "default" : "secondary"} className="whitespace-nowrap">
          {listing.phase}
        </Badge>
      </TableCell>
      <TableCell className="font-medium min-w-[80px] text-right">
        {formatCurrency(listing.value)}
      </TableCell>
      <TableCell className="text-sm min-w-[80px]">
        {formatDate(listing.deadline)}
      </TableCell>
      <TableCell className="min-w-[80px]">
        <Badge variant={getStatusBadgeVariant(listing.status)} className="whitespace-nowrap">
          {listing.status}
        </Badge>
      </TableCell>
      <TableCell className="max-w-[140px] min-w-[120px]">
        <div>
          <div className="font-medium text-sm break-words">
            {listing.profiles?.full_name || 'Unknown User'}
          </div>
          <div className="text-xs text-muted-foreground break-words">
            {listing.profiles?.email || 'No email available'}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm min-w-[80px]">
        {formatDate(listing.submitted_at)}
      </TableCell>
      <TableCell className="w-[80px]">
        <AdminListingsTableActions
          listing={listing}
          processingId={processingId}
          onEdit={onEdit}
          onApprove={onApprove}
          onReject={onReject}
          onHide={onHide}
        />
      </TableCell>
    </TableRow>
  );
};

export default AdminListingsTableRow;
