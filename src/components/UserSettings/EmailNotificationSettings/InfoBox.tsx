
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
              ? "Email notifications are disabled, but you'll still receive in-app notifications for new listings in your selected categories."
              : "You'll receive both email and in-app notifications based on your individual preferences above."
            }
          </p>
          {!emailNotificationsEnabled && (
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Note:</strong> Individual email controls are disabled when master notifications are off, but in-app notifications continue to work.
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            <strong>In-app notifications:</strong> You'll always receive notifications within the app for new listings in your selected categories, regardless of email settings.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Marketing communications:</strong> These emails are independent of the master toggle and can be controlled separately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
