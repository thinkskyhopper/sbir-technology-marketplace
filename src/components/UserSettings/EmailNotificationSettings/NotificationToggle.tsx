
import { ReactNode } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationToggleProps {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const NotificationToggle = ({
  id,
  title,
  description,
  icon,
  checked,
  onCheckedChange,
  disabled
}: NotificationToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label htmlFor={id} className="text-base font-medium flex items-center gap-2">
          {icon}
          {title}
        </Label>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
};

export default NotificationToggle;
