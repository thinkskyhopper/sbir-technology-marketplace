
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { sanitizeErrorMessage, isEmailNotConfirmedError } from '@/utils/errorMessages';

interface SignInFormProps {
  onShowPasswordReset: () => void;
  onSwitchToSignUp: () => void;
}

const SignInForm = ({ onShowPasswordReset, onSwitchToSignUp }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  
  const { signIn, signInWithGoogle, resendVerificationEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsEmailNotConfirmed(false);
    setIsAccountLocked(false);
    setLockedUntil(null);

    try {
      const { error, accountDeleted, isLocked, lockedUntil: lockExpiry } = await signIn(email, password);
      
      if (error) {
        if (accountDeleted) {
          toast.error('Account Deleted', {
            description: 'This account has been deleted. If you believe this is an error, please contact support.',
            duration: 6000,
            className: 'bg-destructive text-destructive-foreground border-destructive'
          });
          setError('This account has been deleted. If you believe this is an error, please contact support.');
        } else if (isLocked) {
          setIsAccountLocked(true);
          setLockedUntil(lockExpiry || null);
          setError(error.message || 'Your account is temporarily locked due to too many failed sign-in attempts.');
        } else {
          // Check if the error is about unverified email
          if (isEmailNotConfirmedError(error)) {
            setIsEmailNotConfirmed(true);
            setError('Please verify your email address before signing in. Check your inbox for a confirmation email.');
          } else {
            setError(sanitizeErrorMessage(error, 'Sign In'));
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setResendingEmail(true);
    
    try {
      const { error } = await resendVerificationEmail(email);
      
      if (error) {
        toast.error('Failed to resend verification email', {
          description: sanitizeErrorMessage(error, 'Resend Verification')
        });
      } else {
        toast.success('Verification Email Sent', {
          description: 'Please check your inbox and click the confirmation link.'
        });
        setIsEmailNotConfirmed(false);
        setError(null);
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(sanitizeErrorMessage(error, 'Google Sign In'));
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@company.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          minLength={6}
        />
      </div>

      <div className="text-right">
        <Button
          type="button"
          variant="link"
          onClick={onShowPasswordReset}
          className="text-sm p-0 h-auto"
        >
          Forgot your password?
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            {isAccountLocked && lockedUntil && (
              <div className="mt-3 space-y-2">
                <div className="text-sm">
                  Your account will automatically unlock at{' '}
                  {new Date(lockedUntil).toLocaleTimeString()} or you can unlock it immediately by resetting your password.
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onShowPasswordReset}
                  className="w-full"
                >
                  Reset Password to Unlock
                </Button>
              </div>
            )}
            {isEmailNotConfirmed && (
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                  className="w-full"
                >
                  {resendingEmail ? 'Sending...' : 'Resend Verification Email'}
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Loading...' : 'Sign In'}
      </Button>


      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignUp}
          className="text-sm"
        >
          Don't have an account? Sign up
        </Button>
      </div>
    </form>
  );
};

export default SignInForm;
