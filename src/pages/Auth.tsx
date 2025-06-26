
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeader from '@/components/Auth/AuthHeader';
import AuthForm from '@/components/Auth/AuthForm';
import PasswordReset from '@/components/PasswordReset';
import UpdatePassword from '@/components/UpdatePassword';

const Auth = () => {
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  useEffect(() => {
    // Check if we're in recovery mode by looking for recovery tokens in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');
    
    console.log('Auth page - URL hash params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
    
    if (type === 'recovery' && accessToken && refreshToken) {
      console.log('Recovery mode detected from URL tokens');
      setIsRecoveryMode(true);
    } else if (mode === 'reset') {
      console.log('Recovery mode detected from search params');
      setIsRecoveryMode(true);
    }
  }, [mode]);

  useEffect(() => {
    // Only redirect authenticated users who are NOT in recovery mode
    if (user && !isRecoveryMode && mode !== 'reset') {
      console.log('Redirecting authenticated user to home');
      navigate('/');
    }
  }, [user, navigate, mode, isRecoveryMode]);

  // Show password update form when user is authenticated and in recovery mode
  if ((isRecoveryMode || mode === 'reset') && user && session) {
    console.log('Showing UpdatePassword component');
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
  if (showPasswordReset || ((mode === 'reset' || isRecoveryMode) && !user)) {
    console.log('Showing PasswordReset component');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthHeader />
          <PasswordReset onBackToSignIn={() => setShowPasswordReset(false)} />
        </div>
      </div>
    );
  }

  console.log('Showing AuthForm component');
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
