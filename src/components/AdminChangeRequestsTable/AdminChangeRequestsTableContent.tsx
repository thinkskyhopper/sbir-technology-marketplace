
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
      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          <ScrollArea className="h-[400px] w-full">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Listing</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Requested</TableHead>
                  <TableHead className="min-w-[150px]">Processed By</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
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
        </div>
        
        {changeRequests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You're all caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
