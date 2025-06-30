
import { Mail, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserWithStats } from "./types";

interface AdminUsersTableRowProps {
  user: UserWithStats;
  onUserClick: (userId: string) => void;
  onPermissionChange: (userId: string, canSubmit: boolean) => void;
  isUpdating: boolean;
}

export const AdminUsersTableRow = ({ 
  user, 
  onUserClick, 
  onPermissionChange, 
  isUpdating 
}: AdminUsersTableRowProps) => {
  console.log(`User ${user.email} can_submit_listings:`, user.can_submit_listings);
  
  const handlePermissionChange = (value: string) => {
    const canSubmit = value === 'enabled';
    console.log(`Changing permission for ${user.email} to:`, canSubmit);
    onPermissionChange(user.id, canSubmit);
  };
  
  return (
    <TableRow key={user.id}>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {(user.full_name || user.email)?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <button
                onClick={() => onUserClick(user.id)}
                className="font-medium text-primary hover:underline cursor-pointer"
              >
                {user.full_name || 'No name provided'}
              </button>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-3 h-3 mr-1" />
                {user.email}
              </div>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant={user.role === 'admin' ? 'default' : user.role === 'consultant' ? 'secondary' : 'outline'}
          className={
            user.role === 'admin' 
              ? 'bg-amber-500 hover:bg-amber-600' 
              : user.role === 'consultant'
              ? 'bg-white hover:bg-gray-50 text-black border-gray-300'
              : ''
          }
        >
          {user.role === 'admin' ? 'Administrator' : user.role === 'consultant' ? 'Consultant' : 'User'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <FileText className="w-3 h-3 text-muted-foreground" />
          <span className="font-medium">{user.listing_count}</span>
          <span className="text-muted-foreground text-sm">
            listing{user.listing_count !== 1 ? 's' : ''}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Select
          value={user.can_submit_listings ? 'enabled' : 'disabled'}
          onValueChange={handlePermissionChange}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-28 bg-white border border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
            <SelectItem value="enabled" className="hover:bg-gray-100">Enabled</SelectItem>
            <SelectItem value="disabled" className="hover:bg-gray-100">Disabled</SelectItem>
          </SelectContent>
        </Select>
        {isUpdating && (
          <div className="text-xs text-muted-foreground mt-1">Updating...</div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(user.created_at).toLocaleDateString()}
        </div>
      </TableCell>
    </TableRow>
  );
};
