
import { useState } from "react";
import { useListings } from "@/hooks/useListings";
import { useSorting } from "@/hooks/useSorting";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditListingDialog from "./EditListingDialog";
import ConfirmActionDialog from "./ConfirmActionDialog";
import AdminListingsTableHeader from "./AdminListingsTable/AdminListingsTableHeader";
import AdminListingsTableRow from "./AdminListingsTable/AdminListingsTableRow";
import AdminListingsTableLoading from "./AdminListingsTable/AdminListingsTableLoading";
import AdminListingsTableEmpty from "./AdminListingsTable/AdminListingsTableEmpty";
import type { SBIRListing } from "@/types/listings";

const AdminListingsTable = () => {
  const { listings, loading, error, approveListing, rejectListing, hideListing, deleteListing } = useListings();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingListing, setEditingListing] = useState<SBIRListing | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean;
    type: 'approve' | 'reject' | 'hide';
    listingId: string;
    listingTitle: string;
  }>({
    show: false,
    type: 'approve',
    listingId: '',
    listingTitle: ''
  });
  const { toast } = useToast();

  // Add sorting functionality
  const { sortedData: sortedListings, sortState, handleSort } = useSorting(listings, {
    column: 'submitted_at',
    direction: 'desc'
  });

  const handleEdit = (listing: SBIRListing) => {
    setEditingListing(listing);
    setShowEditDialog(true);
  };

  const handleApproveClick = (listing: SBIRListing) => {
    setConfirmAction({
      show: true,
      type: 'approve',
      listingId: listing.id,
      listingTitle: listing.title
    });
  };

  const handleRejectClick = (listing: SBIRListing) => {
    setConfirmAction({
      show: true,
      type: 'reject',
      listingId: listing.id,
      listingTitle: listing.title
    });
  };

  const handleHideClick = (listing: SBIRListing) => {
    setConfirmAction({
      show: true,
      type: 'hide',
      listingId: listing.id,
      listingTitle: listing.title
    });
  };

  const handleDeleteClick = async (listing: SBIRListing) => {
    try {
      setProcessingId(listing.id);
      await deleteListing(listing.id);
      toast({
        title: "Listing Deleted",
        description: "The listing has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmAction = async () => {
    try {
      setProcessingId(confirmAction.listingId);
      
      if (confirmAction.type === 'approve') {
        await approveListing(confirmAction.listingId);
        toast({
          title: "Listing Approved",
          description: "The listing has been successfully approved and is now active.",
        });
      } else if (confirmAction.type === 'reject') {
        await rejectListing(confirmAction.listingId);
        toast({
          title: "Listing Rejected",
          description: "The listing has been rejected.",
        });
      } else if (confirmAction.type === 'hide') {
        await hideListing(confirmAction.listingId);
        toast({
          title: "Listing Hidden",
          description: "The listing has been hidden from the marketplace.",
          duration: 5000, // Auto-dismiss after 5 seconds
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${confirmAction.type} listing. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
      setConfirmAction({ show: false, type: 'approve', listingId: '', listingTitle: '' });
    }
  };

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

      <EditListingDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        listing={editingListing}
      />

      <ConfirmActionDialog
        open={confirmAction.show}
        onOpenChange={(open) => setConfirmAction({ ...confirmAction, show: open })}
        onConfirm={handleConfirmAction}
        title={
          confirmAction.type === 'approve' ? 'Approve Listing' :
          confirmAction.type === 'reject' ? 'Reject Listing' : 'Hide Listing'
        }
        description={
          confirmAction.type === 'approve'
            ? `Are you sure you want to approve "${confirmAction.listingTitle}"? This will make it visible to all users.`
            : confirmAction.type === 'reject'
            ? `Are you sure you want to reject "${confirmAction.listingTitle}"? This action cannot be undone.`
            : `Are you sure you want to hide "${confirmAction.listingTitle}"? This will remove it from the marketplace but keep it in the database.`
        }
        confirmText={
          confirmAction.type === 'approve' ? 'Approve' :
          confirmAction.type === 'reject' ? 'Reject' : 'Hide'
        }
        variant={confirmAction.type === 'reject' ? 'destructive' : 'default'}
      />
    </>
  );
};

export default AdminListingsTable;
