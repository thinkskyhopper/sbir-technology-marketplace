
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthHeader from '@/components/Auth/AuthHeader';
import AuthForm from '@/components/Auth/AuthForm';
import PasswordReset from '@/components/PasswordReset';
import UpdatePassword from '@/components/UpdatePassword';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Auth = () => {
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  useEffect(() => {
    console.log('Auth page mounted with:', { 
      mode, 
      hasUser: !!user, 
      hasSession: !!session,
      userEmail: user?.email,
      loading
    });

    // Check if we're in recovery mode by looking for recovery tokens in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');
    
    console.log('Auth page - URL hash params:', { 
      accessToken: !!accessToken, 
      refreshToken: !!refreshToken, 
      type,
      error,
      errorDescription
    });
    
    // Handle auth errors from URL
    if (error) {
      console.error('Auth error from URL:', error, errorDescription);
      if (error === 'access_denied' || errorDescription?.includes('expired')) {
        setAuthError('The password reset link has expired. Please request a new one.');
      } else {
        setAuthError(`Authentication error: ${errorDescription || error}`);
      }
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      return;
    }
    
    if (type === 'recovery' && accessToken && refreshToken) {
      console.log('Recovery mode detected from URL tokens');
      setIsRecoveryMode(true);
      setAuthError(null);
      
      // Clear the URL hash to remove sensitive tokens from the address bar
      // This prevents token exposure in browser history and referrer headers
      window.history.replaceState(
        {}, 
        document.title, 
        window.location.pathname + window.location.search
      );
    } else if (mode === 'reset') {
      console.log('Recovery mode detected from search params');
      setIsRecoveryMode(true);
      setAuthError(null);
      
      // Clear hash if present for consistency
      if (window.location.hash) {
        window.history.replaceState(
          {}, 
          document.title, 
          window.location.pathname + window.location.search
        );
      }
    }
  }, [mode]);

  useEffect(() => {
    // Only redirect authenticated users who are NOT in recovery mode
    if (user && !isRecoveryMode && mode !== 'reset' && !loading) {
      console.log('Redirecting authenticated user to home');
      navigate('/');
    }
  }, [user, navigate, mode, isRecoveryMode, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth error if present
  if (authError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AuthHeader />
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
          <PasswordReset onBackToSignIn={() => {
            setAuthError(null);
            setShowPasswordReset(false);
          }} />
        </div>
      </div>
    );
  }

  // Show password update form when user is authenticated and in recovery mode
  if ((isRecoveryMode || mode === 'reset') && user && session) {
    console.log('Showing UpdatePassword component for user:', user.email);
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
