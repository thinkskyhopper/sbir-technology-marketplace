
import { Loader2 } from 'lucide-react';
import EmailNotificationCard from './EmailNotificationCard';

const LoadingState = () => {
  return (
    <EmailNotificationCard loading>
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    </EmailNotificationCard>
  );
};

export default LoadingState;
