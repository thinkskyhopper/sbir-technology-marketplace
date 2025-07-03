
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MasterToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

const MasterToggle = ({ enabled, onToggle, disabled }: MasterToggleProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <Label htmlFor="email-notifications" className="text-base font-medium">
          Master Email Notifications
        </Label>
        <p className="text-sm text-muted-foreground">
          Turn off all email notifications. You'll only receive in-app notifications.
        </p>
      </div>
      <Switch
        id="email-notifications"
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
    </div>
  );
};

export default MasterToggle;
