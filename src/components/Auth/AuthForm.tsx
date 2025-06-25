
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthFormProps {
  onShowPasswordReset: () => void;
}

const AuthForm = ({ onShowPasswordReset }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSwitchMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{isSignUp ? 'Create Account' : 'Sign In'}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Join the marketplace to buy and sell SBIR technology'
            : 'Welcome back to the marketplace'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSignUp ? (
          <SignUpForm onSwitchToSignIn={handleSwitchMode} />
        ) : (
          <SignInForm 
            onShowPasswordReset={onShowPasswordReset}
            onSwitchToSignUp={handleSwitchMode}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AuthForm;
