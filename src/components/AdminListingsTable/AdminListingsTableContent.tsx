
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminListingsTableRow from "./AdminListingsTableRow";
import SortableTableHead from "./SortableTableHead";
import type { SBIRListing } from "@/types/listings";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminListingsTableContentProps {
  listings: SBIRListing[];
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
  listings,
  processingId,
  sortState,
  onSort,
  onEdit,
  onApprove,
  onReject,
  onHide,
  onDelete,
}: AdminListingsTableContentProps) => {
  const isMobile = useIsMobile();

  // Mobile card layout
  if (isMobile) {
    return (
      <div className="space-y-4">
        {listings.map((listing) => (
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
      </div>
    );
  }

  // Desktop table layout
  return (
    <ScrollArea className="h-[600px] w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead sortColumn="title" sortState={sortState} onSort={onSort}>
              Title
            </SortableTableHead>
            <SortableTableHead sortColumn="agency" sortState={sortState} onSort={onSort}>
              Agency
            </SortableTableHead>
            <SortableTableHead sortColumn="phase" sortState={sortState} onSort={onSort}>
              Phase
            </SortableTableHead>
            <SortableTableHead sortColumn="value" sortState={sortState} onSort={onSort}>
              Value
            </SortableTableHead>
            <SortableTableHead sortColumn="deadline" sortState={sortState} onSort={onSort}>
              Deadline
            </SortableTableHead>
            <SortableTableHead sortColumn="status" sortState={sortState} onSort={onSort}>
              Status
            </SortableTableHead>
            <TableHead>User</TableHead>
            <SortableTableHead sortColumn="submitted_at" sortState={sortState} onSort={onSort}>
              Submitted
            </SortableTableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
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
