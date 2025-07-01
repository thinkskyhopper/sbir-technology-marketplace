
import AdminListingsTableContent from "./AdminListingsTableContent";
import AdminListingsTablePagination from "./AdminListingsTablePagination";
import type { SBIRListing } from "@/types/listings";

interface AdminListingsTableContainerContentProps {
  paginatedData: SBIRListing[];
  filteredListings: SBIRListing[];
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
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
}

const AdminListingsTableContainerContent = ({
  paginatedData,
  filteredListings,
  processingId,
  sortState,
  onSort,
  onEdit,
  onApprove,
  onReject,
  onHide,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  onPreviousPage,
  onNextPage,
  hasNextPage,
  hasPreviousPage,
  totalItems,
}: AdminListingsTableContainerContentProps) => {
  return (
    <>
      <AdminListingsTableContent
        listings={paginatedData}
        processingId={processingId}
        sortState={sortState}
        onSort={onSort}
        onEdit={onEdit}
        onApprove={onApprove}
        onReject={onReject}
        onHide={onHide}
        onDelete={onDelete}
      />
      
      {filteredListings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No listings match your current filters.</p>
        </div>
      )}
      
      {filteredListings.length > 0 && (
        <AdminListingsTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          totalItems={totalItems}
          startItem={(currentPage - 1) * 10 + 1}
          endItem={Math.min(currentPage * 10, totalItems)}
        />
      )}
    </>
  );
};

export default AdminListingsTableContainerContent;
