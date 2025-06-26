
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import type { ListingChangeRequest } from "@/types/changeRequests";

interface AdminChangeRequestsTableDialogProps {
  selectedRequest: ListingChangeRequest | null;
  showDetailsDialog: boolean;
  setShowDetailsDialog: (show: boolean) => void;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  processingId: string | null;
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
  getAdminInfo: (adminId: string) => string;
}

export const AdminChangeRequestsTableDialog = ({
  selectedRequest,
  showDetailsDialog,
  setShowDetailsDialog,
  adminNotes,
  setAdminNotes,
  processingId,
  onApprove,
  onReject,
  getAdminInfo
}: AdminChangeRequestsTableDialogProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  if (!selectedRequest) return null;

  // Use preserved listing information if available, otherwise fall back to joined data
  const listingTitle = selectedRequest.listing_title || 
                      (selectedRequest as any).sbir_listings?.title || 
                      'Deleted Listing';
  
  const listingAgency = selectedRequest.listing_agency || 
                       (selectedRequest as any).sbir_listings?.agency || 
                       'Unknown Agency';

  const isListingDeleted = !selectedRequest.listing_id;

  return (
    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedRequest.request_type === 'change' ? 'Change' : 'Deletion'} Request Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Listing Information</h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <p><strong>Title:</strong> {listingTitle}</p>
                {isListingDeleted && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Deleted
                  </Badge>
                )}
              </div>
              <p><strong>Agency:</strong> {listingAgency}</p>
            </div>
          </div>

          {selectedRequest.request_type === 'change' && selectedRequest.requested_changes && (
            <div>
              <h3 className="font-medium mb-2">Requested Changes</h3>
              <div className="bg-muted p-3 rounded">
                {Object.entries(selectedRequest.requested_changes)
                  .filter(([_, value]) => value !== null && value !== undefined && value !== '')
                  .map(([key, value]) => {
                    const fieldName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <p key={key}><strong>{fieldName}:</strong> {String(value)}</p>
                    );
                  })}
              </div>
            </div>
          )}

          {selectedRequest.reason && (
            <div>
              <h3 className="font-medium mb-2">Reason</h3>
              <p className="bg-muted p-3 rounded whitespace-pre-wrap">{selectedRequest.reason}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Request Status</h3>
            <div className="space-y-2">
              <p><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(selectedRequest.status)}>{selectedRequest.status}</Badge></p>
              <p><strong>Submitted:</strong> {format(new Date(selectedRequest.created_at), 'PPP')}</p>
              {selectedRequest.processed_at && (
                <>
                  <p><strong>Processed:</strong> {format(new Date(selectedRequest.processed_at), 'PPP')}</p>
                  {selectedRequest.processed_by && (
                    <p><strong>Processed by:</strong> {getAdminInfo(selectedRequest.processed_by)}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {selectedRequest.status === 'pending' && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium mb-2">Admin Notes (Optional)</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about your decision..."
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => onReject(selectedRequest.id)}
                  disabled={processingId === selectedRequest.id}
                >
                  {processingId === selectedRequest.id ? "Processing..." : "Reject"}
                </Button>
                <Button
                  onClick={() => onApprove(selectedRequest.id)}
                  disabled={processingId === selectedRequest.id}
                >
                  {processingId === selectedRequest.id ? "Processing..." : "Approve"}
                </Button>
              </div>
            </div>
          )}

          {selectedRequest.admin_notes && (
            <div>
              <h3 className="font-medium mb-2">Admin Notes</h3>
              <p className="bg-muted p-3 rounded">{selectedRequest.admin_notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
