
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ListingChangeRequest } from "@/types/changeRequests";
import type { AdminProfile } from "./types";
import { AdminChangeRequestsTableRow } from "./AdminChangeRequestsTableRow";

interface AdminChangeRequestsTableContentProps {
  changeRequests: ListingChangeRequest[];
  processingId: string | null;
  adminProfiles: { [key: string]: AdminProfile };
  onViewDetails: (request: ListingChangeRequest) => void;
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
  getAdminInfo: (adminId: string) => string;
}

export const AdminChangeRequestsTableContent = ({
  changeRequests,
  processingId,
  adminProfiles,
  onViewDetails,
  onApprove,
  onReject,
  getAdminInfo
}: AdminChangeRequestsTableContentProps) => {
  return (
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
                <AdminChangeRequestsTableRow
                  key={request.id}
                  request={request}
                  processingId={processingId}
                  onViewDetails={onViewDetails}
                  onApprove={onApprove}
                  onReject={onReject}
                  getAdminInfo={getAdminInfo}
                />
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
  );
};
