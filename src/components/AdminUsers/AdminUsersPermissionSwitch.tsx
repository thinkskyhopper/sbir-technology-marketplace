
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface AdminUsersPermissionSwitchProps {
  canSubmit: boolean;
  isUpdating: boolean;
  onPermissionChange: (checked: boolean) => void;
}

export const AdminUsersPermissionSwitch = ({
  canSubmit,
  isUpdating,
  onPermissionChange
}: AdminUsersPermissionSwitchProps) => {
  if (isUpdating) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Updating...</span>
      </div>
    );
  }

  return (
    <Switch
      checked={canSubmit}
      onCheckedChange={onPermissionChange}
    />
  );
};
