import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { checkPasswordStrength, type PasswordStrength } from '@/utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = checkPasswordStrength(password);
  
  if (!password) return null;

  const requirements = [
    { label: 'At least 8 characters', met: strength.checks.length },
    { label: 'One uppercase letter', met: strength.checks.uppercase },
    { label: 'One lowercase letter', met: strength.checks.lowercase },
    { label: 'One number', met: strength.checks.number },
    { label: 'One special character', met: strength.checks.special }
  ];

  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'text-destructive';
    if (score <= 3) return 'text-yellow-500';
    if (score <= 4) return 'text-blue-500';
    return 'text-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Password strength:</span>
        <span className={`text-sm font-medium ${getStrengthColor(strength.score)}`}>
          {getStrengthText(strength.score)}
        </span>
      </div>
      
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2">
            {req.met ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <Circle className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={`text-xs ${req.met ? 'text-green-600' : 'text-muted-foreground'}`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;