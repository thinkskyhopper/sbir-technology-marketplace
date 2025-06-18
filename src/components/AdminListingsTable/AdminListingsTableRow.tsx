
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AdminListingsTableActions from "./AdminListingsTableActions";
import type { SBIRListing } from "@/types/listings";

interface AdminListingsTableRowProps {
  listing: SBIRListing;
  processingId: string | null;
  onEdit: (listing: SBIRListing) => void;
  onApprove: (listing: SBIRListing) => void;
  onReject: (listing: SBIRListing) => void;
}

const AdminListingsTableRow = ({
  listing,
  processingId,
  onEdit,
  onApprove,
  onReject,
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
      default:
        return 'outline';
    }
  };

  return (
    <TableRow>
      <TableCell className="max-w-xs">
        <div>
          <div className="font-medium truncate">{listing.title}</div>
          <div className="text-sm text-muted-foreground truncate">
            {listing.category}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm">{listing.agency}</TableCell>
      <TableCell>
        <Badge variant={listing.phase === "Phase I" ? "default" : "secondary"}>
          {listing.phase}
        </Badge>
      </TableCell>
      <TableCell className="font-medium">
        {formatCurrency(listing.value)}
      </TableCell>
      <TableCell className="text-sm">
        {formatDate(listing.deadline)}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(listing.status)}>
          {listing.status}
        </Badge>
      </TableCell>
      <TableCell className="text-sm">
        {formatDate(listing.submitted_at)}
      </TableCell>
      <TableCell>
        <AdminListingsTableActions
          listing={listing}
          processingId={processingId}
          onEdit={onEdit}
          onApprove={onApprove}
          onReject={onReject}
        />
      </TableCell>
    </TableRow>
  );
};

export default AdminListingsTableRow;
