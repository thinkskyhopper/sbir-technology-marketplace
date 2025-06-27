
import { useListings } from "@/hooks/useListings";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";
import { useAdminListingsTableState as useComponentState } from "@/hooks/useAdminListingsTableState";
import { useAdminListingsTableHandlers } from "@/hooks/useAdminListingsTableHandlers";
import { useListingChangeRequests } from "@/hooks/useListingChangeRequests";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import AdminListingsTableFilters from "./AdminListingsTableFilters";
import AdminListingsTableContent from "./AdminListingsTableContent";
import AdminListingsTableLoading from "./AdminListingsTableLoading";
import AdminListingsTableDialogs from "./AdminListingsTableDialogs";
import AdminListingsTablePagination from "./AdminListingsTablePagination";
import { useAdminListingsTableState, useAdminListingsTableLogic } from "./AdminListingsTableState";

const AdminListingsTableContainer = () => {
  const { listings, loading, error, approveListing, rejectListing, hideListing, deleteListing } = useListings();
  
  // Filter and search state
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    phaseFilter,
    setPhaseFilter,
    agencyFilter,
    setAgencyFilter,
    categoryFilter,
    setCategoryFilter,
    handleClearFilters,
    hasActiveFilters,
  } = useAdminListingsTableState();

  // Business logic
  const { filteredListings, uniqueAgencies } = useAdminListingsTableLogic(
    listings,
    searchTerm,
    statusFilter,
    phaseFilter,
    agencyFilter,
    categoryFilter
  );
  
  const {
    processingId,
    setProcessingId,
    editingListing,
    setEditingListing,
    showEditDialog,
    setShowEditDialog,
    confirmAction,
    setConfirmAction,
  } = useComponentState();

  const {
    handleEdit,
    handleApproveClick,
    handleRejectClick,
    handleHideClick,
    handleDeleteClick,
    handleConfirmAction,
  } = useAdminListingsTableHandlers({
    approveListing,
    rejectListing,
    hideListing,
    deleteListing,
    setProcessingId,
    setEditingListing,
    setShowEditDialog,
    setConfirmAction,
    confirmAction,
  });

  // Add sorting functionality
  const { sortedData: sortedListings, sortState, handleSort } = useSorting(filteredListings, {
    column: 'submitted_at',
    direction: 'desc'
  });

  // Add pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    totalItems,
    resetPagination
  } = usePagination({
    data: sortedListings,
    itemsPerPage: 10
  });

  // Reset pagination when filters change - use useEffect to avoid infinite loops
  useEffect(() => {
    resetPagination();
  }, [searchTerm, statusFilter, phaseFilter, agencyFilter, categoryFilter]);

  // Load change request data for indicators (optimized to avoid repeated calls)
  const { refetch: refetchChangeRequests } = useListingChangeRequests();

  if (loading) {
    return <AdminListingsTableLoading />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading listings: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div>
              <CardTitle>All SBIR Listings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {totalItems} total listings, {filteredListings.length} showing
              </p>
            </div>
            <AdminListingsTableFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              phaseFilter={phaseFilter}
              setPhaseFilter={setPhaseFilter}
              agencyFilter={agencyFilter}
              setAgencyFilter={setAgencyFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              uniqueAgencies={uniqueAgencies}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </CardHeader>
        <CardContent>
          <AdminListingsTableContent
            paginatedData={paginatedData}
            processingId={processingId}
            sortState={sortState}
            onSort={handleSort}
            onEdit={handleEdit}
            onApprove={handleApproveClick}
            onReject={handleRejectClick}
            onHide={handleHideClick}
            onDelete={handleDeleteClick}
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
              onPageChange={goToPage}
              onPreviousPage={goToPreviousPage}
              onNextPage={goToNextPage}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              totalItems={totalItems}
              startItem={(currentPage - 1) * 10 + 1}
              endItem={Math.min(currentPage * 10, totalItems)}
            />
          )}
        </CardContent>
      </Card>

      <AdminListingsTableDialogs
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        editingListing={editingListing}
        confirmAction={confirmAction}
        setConfirmAction={setConfirmAction}
        onConfirmAction={handleConfirmAction}
      />
    </>
  );
};

export default AdminListingsTableContainer;
