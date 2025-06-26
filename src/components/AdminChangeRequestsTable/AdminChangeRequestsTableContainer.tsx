
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useAdminChangeRequestsState } from "./useAdminChangeRequestsState";
import { AdminChangeRequestsTableContent } from "./AdminChangeRequestsTableContent";
import { AdminChangeRequestsTableDialog } from "./AdminChangeRequestsTableDialog";

const AdminChangeRequestsTableContainer = () => {
  const { isAdmin } = useAuth();
  const {
    changeRequests,
    loading,
    error,
    selectedRequest,
    showDetailsDialog,
    setShowDetailsDialog,
    adminNotes,
    setAdminNotes,
    processingId,
    adminProfiles,
    handleViewDetails,
    handleApprove,
    handleReject,
    getAdminInfo
  } = useAdminChangeRequestsState();

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
      <AdminChangeRequestsTableContent
        changeRequests={changeRequests}
        processingId={processingId}
        adminProfiles={adminProfiles}
        onViewDetails={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
        getAdminInfo={getAdminInfo}
      />

      <AdminChangeRequestsTableDialog
        selectedRequest={selectedRequest}
        showDetailsDialog={showDetailsDialog}
        setShowDetailsDialog={setShowDetailsDialog}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        processingId={processingId}
        onApprove={handleApprove}
        onReject={handleReject}
        getAdminInfo={getAdminInfo}
      />
    </>
  );
};

export default AdminChangeRequestsTableContainer;
