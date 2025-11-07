
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SignInFormProps {
  onShowPasswordReset: () => void;
  onSwitchToSignUp: () => void;
}

const SignInForm = ({ onShowPasswordReset, onSwitchToSignUp }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error, accountDeleted } = await signIn(email, password);
      
      if (error) {
        if (accountDeleted) {
          toast.error('Account Deleted', {
            description: 'This account has been deleted. If you believe this is an error, please contact support.',
            duration: 6000
          });
          setError('This account has been deleted. If you believe this is an error, please contact support.');
        } else {
          setError(error.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message);
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
          <AlertDescription>{error}</AlertDescription>
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
