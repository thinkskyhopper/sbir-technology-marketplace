
import type { ListingChangeRequest } from "@/types/changeRequests";
import { AdminChangeRequestsTableDialogInfoCards } from "./AdminChangeRequestsTableDialogInfoCards";

interface AdminChangeRequestsTableDialogContentProps {
  selectedRequest: ListingChangeRequest;
  getAdminInfo: (adminId: string) => string;
}

export const AdminChangeRequestsTableDialogContent = ({
  selectedRequest,
  getAdminInfo
}: AdminChangeRequestsTableDialogContentProps) => {
  return (
    <AdminChangeRequestsTableDialogInfoCards 
      selectedRequest={selectedRequest}
      getAdminInfo={getAdminInfo}
    />
  );
};
