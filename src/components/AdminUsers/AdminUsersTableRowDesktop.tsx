
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { UserWithStats } from "./types";
import { AdminUsersRoleSelect } from "./AdminUsersRoleSelect";
import { AdminUsersPermissionSwitch } from "./AdminUsersPermissionSwitch";
import { AdminUsersNotificationButton } from "./AdminUsersNotificationButton";

interface AdminUsersTableRowDesktopProps {
  user: UserWithStats;
  onUserClick: (userId: string) => void;
  onPermissionChange: (userId: string, canSubmit: boolean) => Promise<void>;
  onRoleChange: (userId: string, newRole: string) => Promise<void>;
  isUpdating: boolean;
  isUpdatingRole: boolean;
  onNotificationClick: () => void;
}

export const AdminUsersTableRowDesktop = ({
  user,
  onUserClick,
  onPermissionChange,
  onRoleChange,
  isUpdating,
  isUpdatingRole,
  onNotificationClick
}: AdminUsersTableRowDesktopProps) => {
  const hasNotifications = user.notification_categories && user.notification_categories.length > 0;
  const notificationCount = user.notification_categories?.length || 0;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'consultant': return 'secondary';
      case 'user': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div>
          <button
            onClick={() => onUserClick(user.id)}
            className="font-medium text-sm hover:text-primary transition-colors"
          >
            {user.full_name || 'N/A'}
          </button>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </TableCell>
      <TableCell>
        <AdminUsersRoleSelect
          role={user.role}
          isUpdating={isUpdatingRole}
          onRoleChange={(value) => onRoleChange(user.id, value)}
          className="w-32"
        />
      </TableCell>
      <TableCell>
        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
          {user.listing_count}
        </Badge>
      </TableCell>
      <TableCell>
        <AdminUsersPermissionSwitch
          canSubmit={user.can_submit_listings}
          isUpdating={isUpdating}
          onPermissionChange={(checked) => onPermissionChange(user.id, checked)}
        />
      </TableCell>
      <TableCell>
        <AdminUsersNotificationButton
          hasNotifications={hasNotifications}
          notificationCount={notificationCount}
          onClick={onNotificationClick}
        />
      </TableCell>
      <TableCell>
        <span className="text-sm">{format(new Date(user.created_at), 'MMM d, yyyy')}</span>
      </TableCell>
    </TableRow>
  );
};
