import { Mail, Calendar, FileText, ChevronDown, Bell, Lock, Unlock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserWithStats } from "./types";
import { useState } from "react";
import { NotificationCategoriesDialog } from "./NotificationCategoriesDialog";
import { useAccountUnlock } from "./useAccountUnlock";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ProfileAvatar from "@/components/ui/ProfileAvatar";

type UserRole = "admin" | "user" | "affiliate" | "verified";

interface AdminUsersTableRowProps {
  user: UserWithStats;
  onUserClick: (userId: string) => void;
  onPermissionChange: (userId: string, canSubmit: boolean) => void;
  onRoleChange: (userId: string, role: UserRole) => void;
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
  const unlockMutation = useAccountUnlock();
  
  console.log(`User ${user.email} can_submit_listings:`, user.can_submit_listings);
  
  const handlePermissionChange = (value: string) => {
    const canSubmit = value === 'enabled';
    console.log(`Changing permission for ${user.email} to:`, canSubmit);
    onPermissionChange(user.id, canSubmit);
  };

  const handleRoleChange = (newRole: UserRole) => {
    console.log(`Changing role for ${user.email} to:`, newRole);
    onRoleChange(user.id, newRole);
  };
  
  const isAdmin = user.role === 'admin';
  
  // Check if user has notification categories
  const hasNotifications = user.notification_categories && 
    Array.isArray(user.notification_categories) && 
    user.notification_categories.length > 0;
  
  const notificationCategories = hasNotifications 
    ? user.notification_categories.filter((cat): cat is string => typeof cat === 'string')
    : [];
  
  return (
    <>
      <TableRow key={user.id}>
        <TableCell className="min-w-[200px]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <ProfileAvatar
                photoUrl={(user as UserWithStats & { photo_url?: string | null }).photo_url}
                name={user.full_name}
                email={user.email}
                className="w-8 h-8 flex-shrink-0"
                fallbackClassName="text-sm bg-primary/10 text-primary"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUserClick(user.id)}
                    className="font-medium text-primary hover:underline cursor-pointer text-sm block truncate"
                  >
                    {user.full_name || 'No name provided'}
                  </button>
                  {user.account_locked && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="destructive" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            <div>Reason: {user.lock_reason || 'Security'}</div>
                            {user.account_locked_until && (
                              <div>Until: {new Date(user.account_locked_until).toLocaleString()}</div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.account_locked && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => unlockMutation.mutate(user.id)}
                    disabled={unlockMutation.isPending}
                    className="mt-1 h-6 text-xs"
                  >
                    <Unlock className="w-3 h-3 mr-1" />
                    {unlockMutation.isPending ? 'Unlocking...' : 'Unlock Account'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell className="min-w-[150px]">
          <div className="flex items-center space-x-2">
            <Badge 
              variant={
                user.role === 'admin' 
                  ? 'default' 
                  : user.role === 'affiliate' 
                  ? 'secondary' 
                  : user.role === 'verified'
                  ? 'outline'
                  : 'outline'
              }
              className={
                user.role === 'admin' 
                  ? 'bg-amber-500 hover:bg-amber-600 text-xs' 
                  : user.role === 'affiliate'
                  ? 'bg-[#006ede] hover:bg-[#0060c9] text-white text-xs'
                  : 'text-xs'
              }
            >
              {user.role === 'admin' 
                ? 'Administrator' 
                : user.role === 'affiliate' 
                ? 'Affiliate' 
                : user.role === 'verified'
                ? 'User'
                : 'User'}
            </Badge>
            {user.role === 'verified' && (
              <Badge 
                variant="outline"
                className="bg-[#5593F7] hover:bg-[#5593F7]/80 text-white border-[#5593F7] text-xs"
              >
                Verified
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 flex-shrink-0"
                  disabled={isUpdatingRole}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-32">
                <DropdownMenuItem 
                  onClick={() => handleRoleChange('user')}
                  disabled={user.role === 'user'}
                >
                  User
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleRoleChange('affiliate')}
                  disabled={user.role === 'affiliate'}
                >
                  Affiliate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleRoleChange('verified')}
                  disabled={user.role === 'verified'}
                >
                  Verified User
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleRoleChange('admin')}
                  disabled={user.role === 'admin'}
                >
                  Administrator
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isUpdatingRole && (
              <div className="text-xs text-muted-foreground">Updating...</div>
            )}
          </div>
        </TableCell>
        <TableCell className="min-w-[100px]">
          <div className="flex items-center space-x-1">
            <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="font-medium text-sm">{user.listing_count}</span>
            <span className="text-muted-foreground text-sm">
              listing{user.listing_count !== 1 ? 's' : ''}
            </span>
          </div>
        </TableCell>
        <TableCell className="min-w-[120px]">
          {isAdmin ? (
            <div className="text-sm text-muted-foreground">
              Admin privileges
            </div>
          ) : (
            <>
              <Select
                key={`permission-${user.id}-${user.can_submit_listings}`}
                value={user.can_submit_listings ? 'enabled' : 'disabled'}
                onValueChange={handlePermissionChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-24 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
              {isUpdating && (
                <div className="text-xs text-muted-foreground mt-1">Updating...</div>
              )}
            </>
          )}
        </TableCell>
        <TableCell className="min-w-[150px]">
          <div className="flex items-center space-x-2">
            <Bell className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            {hasNotifications ? (
              <button
                onClick={() => setShowNotificationDialog(true)}
                className="text-sm text-primary hover:underline font-medium"
              >
                Yes ({notificationCategories.length})
              </button>
            ) : (
              <span className="text-sm text-muted-foreground">No</span>
            )}
          </div>
        </TableCell>
        <TableCell className="min-w-[120px]">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </TableCell>
      </TableRow>

      <NotificationCategoriesDialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
        userEmail={user.email}
        userName={user.full_name}
        categories={notificationCategories}
      />
    </>
  );
};
