
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminListingsTableRow from "./AdminListingsTableRow";
import SortableTableHead from "./SortableTableHead";
import type { SBIRListing } from "@/types/listings";
import type { SortState } from "@/hooks/useSorting";

interface AdminListingsTableContentProps {
  listings: SBIRListing[];
  processingId: string | null;
  sortState: SortState;
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
  return (
    <TooltipProvider>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              <SortableTableHead
                sortKey="title"
                currentSortColumn={sortState.column}
                currentSortDirection={sortState.direction}
                onSort={onSort}
                className="min-w-[250px]"
              >
                Title
              </SortableTableHead>
              <SortableTableHead
                sortKey="agency"
                currentSortColumn={sortState.column}
                currentSortDirection={sortState.direction}
                onSort={onSort}
                className="min-w-[120px]"
              >
                Agency
              </SortableTableHead>
              <SortableTableHead
                sortKey="phase"
                currentSortColumn={sortState.column}
                currentSortDirection={sortState.direction}
                onSort={onSort}
                className="min-w-[80px]"
              >
                Phase
              </SortableTableHead>
              <SortableTableHead
                sortKey="value"
                currentSortColumn={sortState.column}
                currentSortDirection={sortState.direction}
                onSort={onSort}
                className="text-right min-w-[100px]"
              >
                Value
              </SortableTableHead>
              <SortableTableHead
                sortKey="status"
                currentSortColumn={sortState.column}
                currentSortDirection={sortState.direction}
                onSort={onSort}
                className="min-w-[100px]"
              >
                Status
              </SortableTableHead>
              <TableHead className="min-w-[180px]">Submitter</TableHead>
              <SortableTableHead
                sortKey="submitted_at"
                currentSortColumn={sortState.column}
                currentSortDirection={sortState.direction}
                onSort={onSort}
                className="min-w-[120px]"
              >
                Submitted
              </SortableTableHead>
              <TableHead className="min-w-[80px]">Actions</TableHead>
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
      </div>
    </TooltipProvider>
  );
};

export default AdminListingsTableContent;
