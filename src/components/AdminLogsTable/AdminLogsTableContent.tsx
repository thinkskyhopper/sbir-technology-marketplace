
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminLogsTableRow } from "./AdminLogsTableRow";
import { AdminLogsTablePagination } from "./AdminLogsTablePagination";
import { SortableTableHead } from "./SortableTableHead";
import type { AdminAuditLog } from "./types";
import type { SortState } from "@/hooks/useSorting";

interface AdminLogsTableContentProps {
  logs: AdminAuditLog[];
  sortState: SortState;
  onSort: (column: string) => void;
  onViewDetails: (log: AdminAuditLog) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const AdminLogsTableContent = ({
  logs,
  sortState,
  onSort,
  onViewDetails,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onNextPage,
  onPreviousPage,
  hasNextPage,
  hasPreviousPage,
}: AdminLogsTableContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Admin Audit Logs ({totalItems})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  column="listing_title"
                  sortState={sortState}
                  onSort={onSort}
                  className="w-[300px]"
                >
                  Listing
                </SortableTableHead>
                <SortableTableHead
                  column="action_type"
                  sortState={sortState}
                  onSort={onSort}
                  className="w-[120px]"
                >
                  Action
                </SortableTableHead>
                <SortableTableHead
                  column="created_at"
                  sortState={sortState}
                  onSort={onSort}
                  className="w-[180px]"
                >
                  Date
                </SortableTableHead>
                <TableHead className="w-[200px]">Admin</TableHead>
                <TableHead className="w-[100px]">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <AdminLogsTableRow
                  key={log.id}
                  log={log}
                  onViewDetails={onViewDetails}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        <AdminLogsTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      </CardContent>
    </Card>
  );
};
