
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import AdminListingsTableLoading from "./AdminListingsTableLoading";
import AdminListingsTableDialogs from "./AdminListingsTableDialogs";
import AdminListingsTableContainerHeader from "./AdminListingsTableContainerHeader";
import AdminListingsTableContainerContent from "./AdminListingsTableContainerContent";
import BulkActionsToolbar from "./BulkActionsToolbar";
import { useAdminListingsTableCore } from "@/hooks/useAdminListingsTableCore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const AdminListingsTableContainer = () => {
  const {
    // Data
    listings,
    filteredListings,
    paginatedData,
    uniqueAgencies,
    
    // State
    loading,
    error,
    processingId,
    editingListing,
    showEditDialog,
    setShowEditDialog,
    confirmAction,
    setConfirmAction,
    
    // Filter state
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
    
    // Sorting and pagination
    sortState,
    handleSort,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    totalItems,
    
    // Handlers
    handleEdit,
    handleApproveClick,
    handleRejectClick,
    handleHideClick,
    handleDeleteClick,
    handleConfirmAction,
    
    // Bulk functionality
    selectedCount,
    totalCount,
    isAllSelected,
    isIndeterminate,
    toggleListing,
    toggleAll,
    clearSelection,
    isSelected,
    selectedListingObjects,
    bulkStatusChange,
    bulkDelete,
    bulkOperationsLoading,
  } = useAdminListingsTableCore();

  // Keyboard shortcuts for bulk actions
  useKeyboardShortcuts({
    onSelectAll: toggleAll,
    onClearSelection: clearSelection,
    onBulkDelete: () => {
      if (selectedCount > 0) {
        // This will be handled by the BulkActionsToolbar confirmation dialog
        console.log('Bulk delete shortcut pressed');
      }
    },
    disabled: loading || bulkOperationsLoading
  });

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
          <AdminListingsTableContainerHeader
            totalItems={totalItems}
            filteredCount={filteredListings.length}
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
            listings={listings}
          />
        </CardHeader>
        
        <BulkActionsToolbar
          selectedCount={selectedCount}
          onBulkStatusChange={bulkStatusChange}
          onBulkDelete={bulkDelete}
          onClearSelection={clearSelection}
          loading={bulkOperationsLoading}
        />
        
        <CardContent>
          <AdminListingsTableContainerContent
            paginatedData={paginatedData}
            filteredListings={filteredListings}
            processingId={processingId}
            sortState={sortState}
            onSort={handleSort}
            onEdit={handleEdit}
            onApprove={handleApproveClick}
            onReject={handleRejectClick}
            onHide={handleHideClick}
            onDelete={handleDeleteClick}
            bulkSelection={{ 
              selectedListings: new Set(selectedListingObjects.map(l => l.id)),
              selectedCount, 
              totalCount, 
              isAllSelected, 
              isIndeterminate, 
              toggleListing, 
              toggleAll, 
              clearSelection, 
              isSelected, 
              selectedListingObjects 
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            totalItems={totalItems}
          />
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
