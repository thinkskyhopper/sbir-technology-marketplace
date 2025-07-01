
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface AdminUsersRoleSelectProps {
  role: string;
  isUpdating: boolean;
  onRoleChange: (newRole: string) => void;
  className?: string;
}

export const AdminUsersRoleSelect = ({
  role,
  isUpdating,
  onRoleChange,
  className
}: AdminUsersRoleSelectProps) => {
  if (isUpdating) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Updating...</span>
      </div>
    );
  }

  return (
    <Select value={role} onValueChange={onRoleChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="consultant">Consultant</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};
