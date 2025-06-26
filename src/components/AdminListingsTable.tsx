import { useListings } from "@/hooks/useListings";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";
import { useAdminListingsTableState } from "@/hooks/useAdminListingsTableState";
import { useAdminListingsTableHandlers } from "@/hooks/useAdminListingsTableHandlers";
import { useListingChangeRequests } from "@/hooks/useListingChangeRequests";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import AdminListingsTableFilters from "./AdminListingsTable/AdminListingsTableFilters";
import AdminListingsTableContent from "./AdminListingsTable/AdminListingsTableContent";
import AdminListingsTableLoading from "./AdminListingsTable/AdminListingsTableLoading";
import AdminListingsTableDialogs from "./AdminListingsTable/AdminListingsTableDialogs";
import AdminListingsTablePagination from "./AdminListingsTable/AdminListingsTablePagination";

const AdminListingsTable = () => {
  const { listings, loading, error, approveListing, rejectListing, hideListing, deleteListing } = useListings();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [agencyFilter, setAgencyFilter] = useState<string>("all");
  
  const {
    processingId,
    setProcessingId,
    editingListing,
    setEditingListing,
    showEditDialog,
    setShowEditDialog,
    confirmAction,
    setConfirmAction,
  } = useAdminListingsTableState();

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

  // Filter and search listings
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesSearch = searchTerm === "" || 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
      const matchesPhase = phaseFilter === "all" || listing.phase === phaseFilter;
      const matchesAgency = agencyFilter === "all" || listing.agency === agencyFilter;
      
      return matchesSearch && matchesStatus && matchesPhase && matchesAgency;
    });
  }, [listings, searchTerm, statusFilter, phaseFilter, agencyFilter]);

  // Get unique agencies for filter dropdown
  const uniqueAgencies = useMemo(() => {
    const agencies = [...new Set(listings.map(listing => listing.agency))];
    return agencies.sort();
  }, [listings]);

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
  }, [searchTerm, statusFilter, phaseFilter, agencyFilter]);

  // Load change request data for indicators (optimized to avoid repeated calls)
  const { refetch: refetchChangeRequests } = useListingChangeRequests();

  // Clear all filters helper
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPhaseFilter("all");
    setAgencyFilter("all");
  };

  // Check if any filters are active - Fixed TypeScript error by properly converting searchTerm to boolean
  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || phaseFilter !== "all" || agencyFilter !== "all";

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
          <div className="flex items-center justify-between">
            <CardTitle>All SBIR Listings ({totalItems} total, {filteredListings.length} filtered)</CardTitle>
            <AdminListingsTableFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              phaseFilter={phaseFilter}
              setPhaseFilter={setPhaseFilter}
              agencyFilter={agencyFilter}
              setAgencyFilter={setAgencyFilter}
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

export default AdminListingsTable;
