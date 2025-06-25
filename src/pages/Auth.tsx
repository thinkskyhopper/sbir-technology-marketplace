
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeader from '@/components/Auth/AuthHeader';
import AuthForm from '@/components/Auth/AuthForm';
import PasswordReset from '@/components/PasswordReset';
import UpdatePassword from '@/components/UpdatePassword';

const Auth = () => {
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  useEffect(() => {
    // Only redirect authenticated users who are NOT trying to reset their password
    if (user && mode !== 'reset') {
      navigate('/');
    }
  }, [user, navigate, mode]);

  // Show password update form when user is authenticated and in reset mode
  if (mode === 'reset' && user && session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthHeader />
          <UpdatePassword />
        </div>
      </div>
    );
  }

  // Show password reset form (for unauthenticated users or when explicitly requested)
  if (showPasswordReset || (mode === 'reset' && !user)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthHeader />
          <PasswordReset onBackToSignIn={() => setShowPasswordReset(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <AuthHeader />
        <AuthForm onShowPasswordReset={() => setShowPasswordReset(true)} />
      </div>
    </div>
  );
};

export default Auth;
