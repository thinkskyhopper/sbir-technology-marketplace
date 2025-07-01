
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
import { useIsMobile } from "@/hooks/use-mobile";

const AdminUsersTable = ({ users }: AdminUsersTableProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
        <CardContent>
          {isMobile ? (
            // Mobile card layout
            <div className="space-y-4">
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
            </div>
          ) : (
            // Desktop table layout
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHead column="full_name" sortState={sortState} onSort={handleSort}>
                    User
                  </SortableTableHead>
                  <SortableTableHead column="role" sortState={sortState} onSort={handleSort}>
                    Role
                  </SortableTableHead>
                  <SortableTableHead column="listing_count" sortState={sortState} onSort={handleSort}>
                    Listings
                  </SortableTableHead>
                  <TableHead>Can Submit</TableHead>
                  <TableHead>Email Notifications</TableHead>
                  <SortableTableHead column="created_at" sortState={sortState} onSort={handleSort}>
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
          )}
          
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
