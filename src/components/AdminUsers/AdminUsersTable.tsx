
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useSorting } from "@/hooks/useSorting";
import { AdminUsersTableProps } from "./types";
import { usePermissionChange } from "./usePermissionChange";
import { useRoleChange } from "./useRoleChange";
import { SortableTableHead } from "./SortableTableHead";
import { AdminUsersTableRow } from "./AdminUsersTableRow";
import { NotificationStats } from "./NotificationStats";

const AdminUsersTable = ({ users }: AdminUsersTableProps) => {
  const navigate = useNavigate();
  
  const { sortedData, sortState, handleSort } = useSorting(users || [], {
    column: 'created_at',
    direction: 'desc'
  });

  const { updatingUsers, handleSubmissionPermissionChange } = usePermissionChange(users);
  const { updatingRoles, handleRoleChange } = useRoleChange(users);

  const handleUserClick = (userId: string) => {
    navigate(`/profile?userId=${userId}`);
  };

  return (
    <>
      <NotificationStats users={users} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>All Users</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <SortableTableHead column="full_name" sortState={sortState} onSort={handleSort} className="min-w-[200px]">
                    User
                  </SortableTableHead>
                  <SortableTableHead column="role" sortState={sortState} onSort={handleSort} className="min-w-[150px]">
                    Role
                  </SortableTableHead>
                  <SortableTableHead column="listing_count" sortState={sortState} onSort={handleSort} className="min-w-[100px]">
                    Listings
                  </SortableTableHead>
                  <TableHead className="min-w-[120px]">Can Submit</TableHead>
                  <TableHead className="min-w-[150px]">Email Notifications</TableHead>
                  <SortableTableHead column="created_at" sortState={sortState} onSort={handleSort} className="min-w-[120px]">
                    Joined
                  </SortableTableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData?.map((user) => (
                  <AdminUsersTableRow
                    key={user.id}
                    user={user}
                    onUserClick={handleUserClick}
                    onPermissionChange={handleSubmissionPermissionChange}
                    onRoleChange={handleRoleChange}
                    isUpdating={updatingUsers.has(user.id)}
                    isUpdatingRole={updatingRoles.has(user.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          
          {users?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AdminUsersTable;
