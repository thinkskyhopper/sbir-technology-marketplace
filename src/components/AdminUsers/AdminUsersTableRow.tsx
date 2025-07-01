
import { NotificationCategoriesDialog } from "./NotificationCategoriesDialog";
import { useState } from "react";
import type { UserWithStats } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminUsersTableRowMobile } from "./AdminUsersTableRowMobile";
import { AdminUsersTableRowDesktop } from "./AdminUsersTableRowDesktop";

interface AdminUsersTableRowProps {
  user: UserWithStats;
  onUserClick: (userId: string) => void;
  onPermissionChange: (userId: string, canSubmit: boolean) => Promise<void>;
  onRoleChange: (userId: string, newRole: string) => Promise<void>;
  isUpdating: boolean;
  isUpdatingRole: boolean;
}

export const AdminUsersTableRow = ({
  user,
  onUserClick,
  onPermissionChange,
  onRoleChange,
  isUpdating,
  isUpdatingRole
}: AdminUsersTableRowProps) => {
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const isMobile = useIsMobile();

  const handleNotificationClick = () => {
    setShowNotificationDialog(true);
  };

  const rowProps = {
    user,
    onUserClick,
    onPermissionChange,
    onRoleChange,
    isUpdating,
    isUpdatingRole,
    onNotificationClick: handleNotificationClick
  };

  return (
    <>
      {isMobile ? (
        <AdminUsersTableRowMobile {...rowProps} />
      ) : (
        <AdminUsersTableRowDesktop {...rowProps} />
      )}

      <NotificationCategoriesDialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
        userEmail={user.email}
        userName={user.full_name || 'Unknown User'}
        categories={user.notification_categories || []}
      />
    </>
  );
};
