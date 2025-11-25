
import { Mail, Calendar, FileText, ChevronDown, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserWithStats } from "./types";
import { useState } from "react";
import { NotificationCategoriesDialog } from "./NotificationCategoriesDialog";

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
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary">
                  {(user.full_name || user.email)?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <button
                  onClick={() => onUserClick(user.id)}
                  className="font-medium text-primary hover:underline cursor-pointer text-sm block truncate"
                >
                  {user.full_name || 'No name provided'}
                </button>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
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
                  ? 'bg-white hover:bg-gray-50 text-black border-gray-300 text-xs'
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
