
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Bell, Loader2 } from "lucide-react";
import { NotificationCategoriesDialog } from "./NotificationCategoriesDialog";
import { useState } from "react";
import type { UserWithStats } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'consultant': return 'secondary';
      case 'user': return 'outline';
      default: return 'outline';
    }
  };

  const hasNotifications = user.notification_categories && user.notification_categories.length > 0;
  const notificationCount = user.notification_categories?.length || 0;

  // Mobile card layout
  if (isMobile) {
    return (
      <>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotificationDialog(true)}
                    className={`p-1 ${hasNotifications ? 'text-blue-600' : 'text-muted-foreground'}`}
                  >
                    <Bell className="w-4 h-4" />
                    {notificationCount > 0 && (
                      <span className="ml-1 text-xs">{notificationCount}</span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Email notifications: {notificationCount} categories</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Role:</span>
              <div className="mt-1">
                {isUpdatingRole ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs">Updating...</span>
                  </div>
                ) : (
                  <Select
                    value={user.role}
                    onValueChange={(value) => onRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Listings:</span>
              <p className="font-medium mt-1">{user.listing_count}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Can Submit:</span>
              <div className="mt-1">
                {isUpdating ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-xs">Updating...</span>
                  </div>
                ) : (
                  <Switch
                    checked={user.can_submit_listings}
                    onCheckedChange={(checked) => onPermissionChange(user.id, checked)}
                    size="sm"
                  />
                )}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Joined:</span>
              <p className="text-sm mt-1">{format(new Date(user.created_at), 'MMM d, yyyy')}</p>
            </div>
          </div>
        </div>

        <NotificationCategoriesDialog
          open={showNotificationDialog}
          onOpenChange={setShowNotificationDialog}
          user={user}
        />
      </>
    );
  }

  // Desktop table row layout
  return (
    <>
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
          {isUpdatingRole ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Updating...</span>
            </div>
          ) : (
            <Select
              value={user.role}
              onValueChange={(value) => onRoleChange(user.id, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          )}
        </TableCell>
        <TableCell>
          <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
            {user.listing_count}
          </Badge>
        </TableCell>
        <TableCell>
          {isUpdating ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Updating...</span>
            </div>
          ) : (
            <Switch
              checked={user.can_submit_listings}
              onCheckedChange={(checked) => onPermissionChange(user.id, checked)}
            />
          )}
        </TableCell>
        <TableCell>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotificationDialog(true)}
                className={`${hasNotifications ? 'text-blue-600' : 'text-muted-foreground'}`}
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <span className="ml-1 text-xs">{notificationCount}</span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Email notifications: {notificationCount} categories</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>
        <TableCell>
          <span className="text-sm">{format(new Date(user.created_at), 'MMM d, yyyy')}</span>
        </TableCell>
      </TableRow>

      <NotificationCategoriesDialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
        user={user}
      />
    </>
  );
};
