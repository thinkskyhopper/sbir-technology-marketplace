
import { format } from "date-fns";
import type { UserWithStats } from "./types";
import { AdminUsersRoleSelect } from "./AdminUsersRoleSelect";
import { AdminUsersPermissionSwitch } from "./AdminUsersPermissionSwitch";
import { AdminUsersNotificationButton } from "./AdminUsersNotificationButton";

interface AdminUsersTableRowMobileProps {
  user: UserWithStats;
  onUserClick: (userId: string) => void;
  onPermissionChange: (userId: string, canSubmit: boolean) => Promise<void>;
  onRoleChange: (userId: string, newRole: string) => Promise<void>;
  isUpdating: boolean;
  isUpdatingRole: boolean;
  onNotificationClick: () => void;
}

export const AdminUsersTableRowMobile = ({
  user,
  onUserClick,
  onPermissionChange,
  onRoleChange,
  isUpdating,
  isUpdatingRole,
  onNotificationClick
}: AdminUsersTableRowMobileProps) => {
  const hasNotifications = user.notification_categories && user.notification_categories.length > 0;
  const notificationCount = user.notification_categories?.length || 0;

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-card">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onUserClick(user.id)}
            className="font-medium text-sm hover:text-primary transition-colors text-left truncate w-full"
          >
            {user.full_name || 'N/A'}
          </button>
          <p className="text-xs text-muted-foreground truncate mt-1">{user.email}</p>
        </div>
        <div className="flex items-center space-x-2">
          <AdminUsersNotificationButton
            hasNotifications={hasNotifications}
            notificationCount={notificationCount}
            onClick={onNotificationClick}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Role:</span>
          <div className="mt-1">
            <AdminUsersRoleSelect
              role={user.role}
              isUpdating={isUpdatingRole}
              onRoleChange={(value) => onRoleChange(user.id, value)}
              className="h-7 text-xs"
            />
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Listings:</span>
          <p className="font-medium mt-1">{user.listing_count}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Can Submit:</span>
          <div className="mt-1">
            <AdminUsersPermissionSwitch
              canSubmit={user.can_submit_listings}
              isUpdating={isUpdating}
              onPermissionChange={(checked) => onPermissionChange(user.id, checked)}
            />
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Joined:</span>
          <p className="text-sm mt-1">{format(new Date(user.created_at), 'MMM d, yyyy')}</p>
        </div>
      </div>
    </div>
  );
};
