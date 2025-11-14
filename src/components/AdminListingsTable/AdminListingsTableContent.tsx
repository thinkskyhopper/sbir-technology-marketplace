
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminListingsTableRow from "./AdminListingsTableRow";
import SortableTableHead from "./SortableTableHead";
import BulkSelectionCheckbox from "./BulkSelectionCheckbox";
import type { SBIRListing } from "@/types/listings";
import type { SortState } from "@/hooks/useSorting";
import type { useBulkSelection } from "@/hooks/useBulkSelection";

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
  bulkSelection: ReturnType<typeof useBulkSelection>;
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
  bulkSelection,
}: AdminListingsTableContentProps) => {
  return (
    <TooltipProvider>
      <div className="rounded-md border">
        {/* Mobile: Use native scrolling */}
        <div className="block sm:hidden">
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto touch-pan-x touch-pan-y">
            <Table className="min-w-[1060px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <BulkSelectionCheckbox
                      checked={bulkSelection.isAllSelected}
                      onCheckedChange={bulkSelection.toggleAll}
                      indeterminate={bulkSelection.isIndeterminate}
                      aria-label="Select all listings"
                    />
                  </TableHead>
                  <SortableTableHead
                    sortKey="title"
                    currentSortColumn={sortState.column}
                    currentSortDirection={sortState.direction}
                    onSort={onSort}
                    className="min-w-[160px] sm:min-w-[280px]"
                  >
                    Title
                  </SortableTableHead>
                  <SortableTableHead
                    sortKey="agency"
                    currentSortColumn={sortState.column}
                    currentSortDirection={sortState.direction}
                    onSort={onSort}
                    className="min-w-[100px] sm:min-w-[120px]"
                  >
                    Agency
                  </SortableTableHead>
                  <SortableTableHead
                    sortKey="phase"
                    currentSortColumn={sortState.column}
                    currentSortDirection={sortState.direction}
                    onSort={onSort}
                    className="min-w-[100px]"
                  >
                    Phase
                  </SortableTableHead>
                  <SortableTableHead
                    sortKey="listing_type"
                    currentSortColumn={sortState.column}
                    currentSortDirection={sortState.direction}
                    onSort={onSort}
                    className="min-w-[110px]"
                  >
                    Type
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
                  <TableHead className="min-w-[120px] sm:min-w-[180px]">Submitter</TableHead>
                  <SortableTableHead
                    sortKey="submitted_at"
                    currentSortColumn={sortState.column}
                    currentSortDirection={sortState.direction}
                    onSort={onSort}
                    className="min-w-[100px] sm:min-w-[120px]"
                  >
                    Submitted
                  </SortableTableHead>
                  <TableHead className="min-w-[80px] sm:min-w-[100px]">Actions</TableHead>
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
                    bulkSelection={bulkSelection}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Desktop: Use ScrollArea */}
        <div className="hidden sm:block overflow-x-auto">
          <ScrollArea className="h-[80vh] w-full">
            <Table className="min-w-[1260px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <BulkSelectionCheckbox
                      checked={bulkSelection.isAllSelected}
                      onCheckedChange={bulkSelection.toggleAll}
                      indeterminate={bulkSelection.isIndeterminate}
                      aria-label="Select all listings"
                    />
                  </TableHead>
                  <SortableTableHead
                    sortKey="title"
                    currentSortColumn={sortState.column}
                    currentSortDirection={sortState.direction}
                    onSort={onSort}
                    className="min-w-[160px] sm:min-w-[280px]"
                  >
                    Title
                  </SortableTableHead>
                  <SortableTableHead
                    sortKey="agency"
                    currentSortColumn={sortState.column}
                    currentSortDirection={sortState.direction}
                    onSort={onSort}
                    className="min-w-[100px] sm:min-w-[120px]"
                  >
                    Agency
                  </SortableTableHead>
                  <SortableTableHead
                    sortKey="phase"
                    currentSortColumn={sortState.column}
                    currentSortDirection={sortState.direction}
                    onSort={onSort}
                    className="min-w-[100px]"
                  >
                    Phase
                  </SortableTableHead>
                  <SortableTableHead
                    sortKey="listing_type"
                    currentSortColumn={sortState.column}
                    currentSortDirection={sortState.direction}
                    onSort={onSort}
                    className="min-w-[110px]"
                  >
                    Type
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
                  <TableHead className="min-w-[120px] sm:min-w-[180px]">Submitter</TableHead>
                  <SortableTableHead
                    sortKey="submitted_at"
                    currentSortColumn={sortState.column}
                    currentSortDirection={sortState.direction}
                    onSort={onSort}
                    className="min-w-[100px] sm:min-w-[120px]"
                  >
                    Submitted
                  </SortableTableHead>
                  <TableHead className="min-w-[80px] sm:min-w-[100px]">Actions</TableHead>
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
                    bulkSelection={bulkSelection}
                  />
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdminListingsTableContent;
