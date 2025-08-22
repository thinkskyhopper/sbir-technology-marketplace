
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AdminListingsTableActions from "./AdminListingsTableActions";
import ListingTitleCell from "./components/ListingTitleCell";
import StatusBadgeCell from "./components/StatusBadgeCell";
import UserInfoCell from "./components/UserInfoCell";
import CurrencyCell from "./components/CurrencyCell";
import { format } from "date-fns";
import type { SBIRListing } from "@/types/listings";
import { useListingChangeRequests } from "@/hooks/useListingChangeRequests";

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

  // Add debugging for date_sold field
  console.log('AdminListingsTableRow - Listing:', {
    id: listing.id,
    status: listing.status,
    date_sold: listing.date_sold,
    date_sold_type: typeof listing.date_sold
  });

  const isProcessing = processingId === listing.id;

  return (
    <TableRow className="hover:bg-muted/50">
      <ListingTitleCell 
        listing={listing} 
        requestSummary={requestSummary} 
      />
      
      <TableCell className="max-w-[120px]">
        <p className="text-sm break-words">{listing.agency}</p>
      </TableCell>
      
      <TableCell>
        <Badge variant="phase" className="text-xs">{listing.phase}</Badge>
      </TableCell>
      
      <CurrencyCell value={listing.value} />
      
      <StatusBadgeCell 
        status={listing.status} 
        dateSold={listing.date_sold} 
      />
      
      <UserInfoCell 
        profiles={listing.profiles} 
        userId={listing.user_id} 
      />
      
      <TableCell>
        <span className="text-sm">{format(new Date(listing.submitted_at), 'MMM d, yyyy')}</span>
      </TableCell>
      
      <TableCell className="w-10">
        <AdminListingsTableActions
          listing={listing}
          isProcessing={isProcessing}
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
