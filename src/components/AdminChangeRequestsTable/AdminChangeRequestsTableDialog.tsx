
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Clock, User, Building2, Calendar, FileText, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useChangeRequests } from "@/hooks/useChangeRequests";
import type { ListingChangeRequest } from "@/types/changeRequests";

interface AdminChangeRequestsTableDialogProps {
  selectedRequest: ListingChangeRequest | null;
  showDetailsDialog: boolean;
  setShowDetailsDialog: (show: boolean) => void;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  adminNotesForUser: string;
  setAdminNotesForUser: (notes: string) => void;
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
  adminNotesForUser,
  setAdminNotesForUser,
  processingId,
  onApprove,
  onReject,
  getAdminInfo
}: AdminChangeRequestsTableDialogProps) => {
  const [savingNotes, setSavingNotes] = useState(false);
  const { updateChangeRequestStatus } = useChangeRequests();
  const { toast } = useToast();

  if (!selectedRequest) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusBadgeClassName = (status: string) => {
    if (status === 'approved') {
      return 'bg-green-600 hover:bg-green-700 text-white border-transparent';
    }
    return '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSaveInternalNotes = async () => {
    if (!selectedRequest || !adminNotes.trim()) return;

    try {
      setSavingNotes(true);
      await updateChangeRequestStatus(
        selectedRequest.id, 
        selectedRequest.status as 'approved' | 'rejected', 
        adminNotes
      );
      
      toast({
        title: "Notes Saved",
        description: "Internal admin notes have been updated successfully.",
      });
      
      // Update the selected request with new notes
      selectedRequest.admin_notes = adminNotes;
      setAdminNotes("");
    } catch (error) {
      console.error('Error saving internal notes:', error);
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const isProcessed = selectedRequest.status !== 'pending';

  return (
    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Change Request Details</span>
            <Badge 
              variant={getStatusBadgeVariant(selectedRequest.status)}
              className={getStatusBadgeClassName(selectedRequest.status)}
            >
              {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Listing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>Listing Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>Title:</strong> {selectedRequest.listing_title || 'Unknown'}
              </div>
              <div>
                <strong>Agency:</strong> {selectedRequest.listing_agency || 'Unknown'}
              </div>
              <div>
                <strong>Request Type:</strong> 
                <span className="ml-2 capitalize">{selectedRequest.request_type}</span>
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Request Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>Submitted:</strong> {formatDate(selectedRequest.created_at)}
              </div>
              {selectedRequest.processed_at && (
                <div>
                  <strong>Processed:</strong> {formatDate(selectedRequest.processed_at)}
                </div>
              )}
              {selectedRequest.processed_by && (
                <div>
                  <strong>Processed By:</strong> {getAdminInfo(selectedRequest.processed_by)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requested Changes */}
          {selectedRequest.request_type === 'change' && selectedRequest.requested_changes && (
            <Card>
              <CardHeader>
                <CardTitle>Requested Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(selectedRequest.requested_changes).map(([key, value]) => (
                    <div key={key}>
                      <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {String(value)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reason */}
          {selectedRequest.reason && (
            <Card>
              <CardHeader>
                <CardTitle>Reason for Request</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{selectedRequest.reason}</p>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Internal Admin Notes */}
              <div>
                <Label htmlFor="admin-notes">Internal Notes (Not shared with user)</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal admin notes here..."
                  rows={3}
                />
                {selectedRequest.admin_notes && (
                  <div className="mt-2">
                    <Label className="text-sm font-medium">Current Internal Notes:</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md border">
                      <p className="whitespace-pre-wrap text-sm">{selectedRequest.admin_notes}</p>
                    </div>
                  </div>
                )}
                
                {/* Save button for internal notes (available even after processing) */}
                {adminNotes.trim() && (
                  <Button
                    onClick={handleSaveInternalNotes}
                    disabled={savingNotes}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {savingNotes ? "Saving..." : "Save Internal Notes"}
                  </Button>
                )}
              </div>

              {/* User-Facing Admin Notes - Only show for pending requests */}
              {!isProcessed && (
                <div>
                  <Label htmlFor="admin-notes-for-user">Notes for User (Will be included in email notifications)</Label>
                  <Textarea
                    id="admin-notes-for-user"
                    value={adminNotesForUser}
                    onChange={(e) => setAdminNotesForUser(e.target.value)}
                    placeholder="Add notes that will be shared with the user..."
                    rows={3}
                  />
                  {selectedRequest.admin_notes_for_user && (
                    <div className="mt-2">
                      <Label className="text-sm font-medium">Current User Notes:</Label>
                      <div className="mt-1 p-3 bg-blue-50 rounded-md border border-blue-200">
                        <p className="whitespace-pre-wrap text-sm">{selectedRequest.admin_notes_for_user}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Show existing user notes for processed requests */}
              {isProcessed && selectedRequest.admin_notes_for_user && (
                <div>
                  <Label className="text-sm font-medium">Notes Sent to User:</Label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <p className="whitespace-pre-wrap text-sm">{selectedRequest.admin_notes_for_user}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions - Only show for pending requests */}
          {selectedRequest.status === 'pending' && (
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => onReject(selectedRequest.id)}
                disabled={processingId === selectedRequest.id}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-2" />
                Reject Request
              </Button>
              <Button
                onClick={() => onApprove(selectedRequest.id)}
                disabled={processingId === selectedRequest.id}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve Request
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
