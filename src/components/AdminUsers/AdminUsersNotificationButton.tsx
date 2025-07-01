
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Bell } from "lucide-react";

interface AdminUsersNotificationButtonProps {
  hasNotifications: boolean;
  notificationCount: number;
  onClick: () => void;
}

export const AdminUsersNotificationButton = ({
  hasNotifications,
  notificationCount,
  onClick
}: AdminUsersNotificationButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
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
  );
};
