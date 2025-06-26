
import { useListings } from "@/hooks/useListings";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";
import { useAdminListingsTableState } from "@/hooks/useAdminListingsTableState";
import { useAdminListingsTableHandlers } from "@/hooks/useAdminListingsTableHandlers";
import { useListingChangeRequests } from "@/hooks/useListingChangeRequests";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search, Filter } from "lucide-react";
import AdminListingsTableHeader from "./AdminListingsTable/AdminListingsTableHeader";
import AdminListingsTableRow from "./AdminListingsTable/AdminListingsTableRow";
import AdminListingsTableLoading from "./AdminListingsTable/AdminListingsTableLoading";
import AdminListingsTableEmpty from "./AdminListingsTable/AdminListingsTableEmpty";
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

  // Reset pagination when filters change
  useMemo(() => {
    resetPagination();
  }, [searchTerm, statusFilter, phaseFilter, agencyFilter, resetPagination]);

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
          <div className="flex items-center justify-between">
            <CardTitle>All SBIR Listings ({totalItems} total, {filteredListings.length} filtered)</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Hidden">Hidden</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  <SelectItem value="Phase I">Phase I</SelectItem>
                  <SelectItem value="Phase II">Phase II</SelectItem>
                </SelectContent>
              </Select>
              <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Agency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agencies</SelectItem>
                  {uniqueAgencies.map(agency => (
                    <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchTerm || statusFilter !== "all" || phaseFilter !== "all" || agencyFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPhaseFilter("all");
                    setAgencyFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full">
            <Table>
              <AdminListingsTableHeader
                currentSortColumn={sortState.column}
                currentSortDirection={sortState.direction}
                onSort={handleSort}
              />
              <TableBody>
                {paginatedData.map((listing) => (
                  <AdminListingsTableRow
                    key={listing.id}
                    listing={listing}
                    processingId={processingId}
                    onEdit={handleEdit}
                    onApprove={handleApproveClick}
                    onReject={handleRejectClick}
                    onHide={handleHideClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          
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
