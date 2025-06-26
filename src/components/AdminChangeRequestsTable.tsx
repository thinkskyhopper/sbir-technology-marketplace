import { useState, useEffect } from "react";
import { useChangeRequests } from "@/hooks/useChangeRequests";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Check, X, Eye, User } from "lucide-react";
import { format } from "date-fns";
import type { ListingChangeRequest } from "@/types/changeRequests";

interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
}

const AdminChangeRequestsTable = () => {
  const [changeRequests, setChangeRequests] = useState<ListingChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ListingChangeRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminProfiles, setAdminProfiles] = useState<{ [key: string]: AdminProfile }>({});
  
  const { fetchChangeRequests, updateChangeRequestStatus } = useChangeRequests();
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const loadChangeRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const requests = await fetchChangeRequests(true); // Fetch as admin
      setChangeRequests(requests || []);
      
      // Get unique admin IDs who have processed requests
      const adminIds = [...new Set(requests?.map(r => r.processed_by).filter(Boolean) || [])];
      
      // Fetch admin profiles for processed requests
      if (adminIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', adminIds);
        
        if (profiles) {
          const profilesMap = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as { [key: string]: AdminProfile });
          setAdminProfiles(profilesMap);
        }
      }
    } catch (err) {
      console.error('Failed to load change requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to load change requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadChangeRequests();
    }
  }, [isAdmin]);

  const handleViewDetails = (request: ListingChangeRequest) => {
    setSelectedRequest(request);
    setAdminNotes("");
    setShowDetailsDialog(true);
  };

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await updateChangeRequestStatus(requestId, 'approved', adminNotes);
      toast({
        title: "Request Approved",
        description: "The change request has been approved successfully.",
      });
      await loadChangeRequests();
      setShowDetailsDialog(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to approve the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await updateChangeRequestStatus(requestId, 'rejected', adminNotes);
      toast({
        title: "Request Rejected",
        description: "The change request has been rejected.",
      });
      await loadChangeRequests();
      setShowDetailsDialog(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getAdminInfo = (adminId: string) => {
    const admin = adminProfiles[adminId];
    return admin ? `${admin.full_name || admin.email}` : 'Unknown Admin';
  };

  if (!isAdmin) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need admin privileges to view change requests.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Change Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading change requests...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading change requests: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Listing Change & Deletion Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Processed By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changeRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {(request as any).sbir_listings?.title || 'Unknown Listing'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(request as any).sbir_listings?.agency || 'Unknown Agency'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={request.request_type === 'change' ? 'default' : 'destructive'}>
                        {request.request_type === 'change' ? 'Change' : 'Deletion'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {request.processed_by ? (
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span className="text-sm">{getAdminInfo(request.processed_by)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not processed</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(request);
                                handleApprove(request.id);
                              }}
                              disabled={processingId === request.id}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedRequest(request);
                                handleReject(request.id);
                              }}
                              disabled={processingId === request.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          
          {changeRequests.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No change requests found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRequest?.request_type === 'change' ? 'Change' : 'Deletion'} Request Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Listing Information</h3>
                <p><strong>Title:</strong> {(selectedRequest as any).sbir_listings?.title || 'Unknown'}</p>
                <p><strong>Agency:</strong> {(selectedRequest as any).sbir_listings?.agency || 'Unknown'}</p>
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
                      onClick={() => handleReject(selectedRequest.id)}
                      disabled={processingId === selectedRequest.id}
                    >
                      {processingId === selectedRequest.id ? "Processing..." : "Reject"}
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedRequest.id)}
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
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminChangeRequestsTable;
