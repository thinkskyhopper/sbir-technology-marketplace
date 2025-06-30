
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar } from "lucide-react";
import type { ListingChangeRequest } from "@/types/changeRequests";

interface AdminChangeRequestsTableDialogInfoCardsProps {
  selectedRequest: ListingChangeRequest;
  getAdminInfo: (adminId: string) => string;
}

export const AdminChangeRequestsTableDialogInfoCards = ({
  selectedRequest,
  getAdminInfo
}: AdminChangeRequestsTableDialogInfoCardsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
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
    </>
  );
};
