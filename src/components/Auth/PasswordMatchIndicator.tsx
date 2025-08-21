import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordMatchIndicatorProps {
  password: string;
  confirmPassword: string;
}

const PasswordMatchIndicator = ({ password, confirmPassword }: PasswordMatchIndicatorProps) => {
  // Don't show anything if confirm password is empty
  if (!confirmPassword) {
    return null;
  }

  const passwordsMatch = password === confirmPassword;

  return (
    <div className="flex items-center gap-2 mt-2">
      {passwordsMatch ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600">Passwords match</span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive">Passwords do not match</span>
        </>
      )}
    </div>
  );
};

export default PasswordMatchIndicator;