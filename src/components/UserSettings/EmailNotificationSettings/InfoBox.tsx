
import { Bell } from 'lucide-react';

interface InfoBoxProps {
  emailNotificationsEnabled: boolean;
}

const InfoBox = ({ emailNotificationsEnabled }: InfoBoxProps) => {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div>
          <p className="text-sm font-medium">How this works</p>
          <p className="text-sm text-muted-foreground mt-1">
            {!emailNotificationsEnabled 
              ? "All email notifications are disabled. You'll only receive notifications within the app."
              : "You'll receive email notifications based on your individual preferences above, plus in-app notifications."
            }
          </p>
          {!emailNotificationsEnabled && (
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Note:</strong> Individual controls are disabled when master notifications are off.
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Marketing communications:</strong> These emails are independent of the master toggle and can be controlled separately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
