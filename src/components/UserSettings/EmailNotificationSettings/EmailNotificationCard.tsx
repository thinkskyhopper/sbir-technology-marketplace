
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from 'lucide-react';

interface EmailNotificationCardProps {
  children: ReactNode;
  loading?: boolean;
}

const EmailNotificationCard = ({ children, loading }: EmailNotificationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default EmailNotificationCard;
