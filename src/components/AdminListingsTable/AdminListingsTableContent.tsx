
import { Table, TableBody } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminListingsTableHeader from "./AdminListingsTableHeader";
import AdminListingsTableRow from "./AdminListingsTableRow";
import type { SBIRListing } from "@/types/listings";

interface AdminListingsTableContentProps {
  paginatedData: SBIRListing[];
  processingId: string | null;
  sortState: {
    column: string | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (column: string) => void;
  onEdit: (listing: SBIRListing) => void;
  onApprove: (listing: SBIRListing) => void;
  onReject: (listing: SBIRListing) => void;
  onHide: (listing: SBIRListing) => void;
  onDelete: (listing: SBIRListing) => void;
}

const AdminListingsTableContent = ({
  paginatedData,
  processingId,
  sortState,
  onSort,
  onEdit,
  onApprove,
  onReject,
  onHide,
  onDelete,
}: AdminListingsTableContentProps) => {
  return (
    <ScrollArea className="h-[600px] w-full">
      <Table>
        <AdminListingsTableHeader
          currentSortColumn={sortState.column}
          currentSortDirection={sortState.direction}
          onSort={onSort}
        />
        <TableBody>
          {paginatedData.map((listing) => (
            <AdminListingsTableRow
              key={listing.id}
              listing={listing}
              processingId={processingId}
              onEdit={onEdit}
              onApprove={onApprove}
              onReject={onReject}
              onHide={onHide}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default AdminListingsTableContent;
