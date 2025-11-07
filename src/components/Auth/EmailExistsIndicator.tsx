import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailExistsIndicatorProps {
  emailExists: boolean | null;
  isChecking: boolean;
  onSignInClick: () => void;
}

const EmailExistsIndicator = ({ emailExists, isChecking, onSignInClick }: EmailExistsIndicatorProps) => {
  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Checking email...</span>
      </div>
    );
  }

  if (emailExists === true) {
    return (
      <Alert className="mt-2 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <p className="text-sm mb-2">
            This email looks familiar! Already have an account?
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSignInClick}
            className="border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            Sign In Instead
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default EmailExistsIndicator;
