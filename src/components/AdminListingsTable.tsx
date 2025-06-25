
import { useListings } from "@/hooks/useListings";
import { useSorting } from "@/hooks/useSorting";
import { useAdminListingsTableState } from "@/hooks/useAdminListingsTableState";
import { useAdminListingsTableHandlers } from "@/hooks/useAdminListingsTableHandlers";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import AdminListingsTableHeader from "./AdminListingsTable/AdminListingsTableHeader";
import AdminListingsTableRow from "./AdminListingsTable/AdminListingsTableRow";
import AdminListingsTableLoading from "./AdminListingsTable/AdminListingsTableLoading";
import AdminListingsTableEmpty from "./AdminListingsTable/AdminListingsTableEmpty";
import AdminListingsTableDialogs from "./AdminListingsTable/AdminListingsTableDialogs";

const AdminListingsTable = () => {
  const { listings, loading, error, approveListing, rejectListing, hideListing, deleteListing } = useListings();
  
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

  // Add sorting functionality
  const { sortedData: sortedListings, sortState, handleSort } = useSorting(listings, {
    column: 'submitted_at',
    direction: 'desc'
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
          <CardTitle>All SBIR Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full">
            <Table>
              <AdminListingsTableHeader
                currentSortColumn={sortState.column}
                currentSortDirection={sortState.direction}
                onSort={handleSort}
              />
              <TableBody>
                {sortedListings.map((listing) => (
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
          
          {listings.length === 0 && <AdminListingsTableEmpty />}
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
