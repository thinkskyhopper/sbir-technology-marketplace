
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminListingsTableRow from "./AdminListingsTableRow";
import { SortableTableHead } from "./SortableTableHead";
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                column="title"
                sortState={sortState}
                onSort={onSort}
                className="w-[250px]"
              >
                Title
              </SortableTableHead>
              <SortableTableHead
                column="agency"
                sortState={sortState}
                onSort={onSort}
                className="w-[120px]"
              >
                Agency
              </SortableTableHead>
              <SortableTableHead
                column="phase"
                sortState={sortState}
                onSort={onSort}
              >
                Phase
              </SortableTableHead>
              <SortableTableHead
                column="value"
                sortState={sortState}
                onSort={onSort}
                className="text-right"
              >
                Value
              </SortableTableHead>
              <SortableTableHead
                column="deadline"
                sortState={sortState}
                onSort={onSort}
              >
                Deadline
              </SortableTableHead>
              <SortableTableHead
                column="status"
                sortState={sortState}
                onSort={onSort}
              >
                Status
              </SortableTableHead>
              <TableHead className="min-w-[180px]">Submitter</TableHead>
              <SortableTableHead
                column="submitted_at"
                sortState={sortState}
                onSort={onSort}
              >
                Submitted
              </SortableTableHead>
              <TableHead className="w-16">Actions</TableHead>
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
