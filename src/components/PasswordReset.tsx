
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, ArrowLeft, Mail, CheckCircle, Clock } from 'lucide-react';

interface PasswordResetProps {
  onBackToSignIn: () => void;
}

const PasswordReset = ({ onBackToSignIn }: PasswordResetProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setRateLimited(false);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      console.log('Requesting password reset');
      const { error } = await resetPassword(email);
      
      if (error) {
        console.error('Password reset error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User not found')) {
          setError('No account found with this email address');
        } else if (error.message.includes('rate limit') || error.message.includes('too many')) {
          setError('Too many requests. Please wait a few minutes before trying again');
          setRateLimited(true);
        } else if (error.message.includes('invalid_request')) {
          setError('Invalid request. Please check your email and try again');
        } else {
          setError(error.message || 'An error occurred while sending the reset email');
        }
      } else {
        setSuccess(`Password reset email sent to ${email}! Please check your inbox and follow the instructions to reset your password.`);
        console.log('Password reset email sent successfully');
      }
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
      setError('An unexpected error occurred. Please try again');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Email Sent!</CardTitle>
          <CardDescription>
            Check your email for password reset instructions
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription className="text-center">
              {success}
            </AlertDescription>
          </Alert>

          <div className="mt-6 space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">Next steps:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Check your email inbox for the reset link</li>
                <li>Click the link in the email</li>
                <li>Enter your new password</li>
              </ol>
            </div>
            
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Didn't receive the email?</strong> Check your spam folder or try again with a different email address.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(null);
                  setEmail('');
                }}
                className="w-full"
              >
                Send Another Reset Email
              </Button>
              <Button
                variant="link"
                onClick={onBackToSignIn}
                className="w-full text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              disabled={loading}
              className={error ? 'border-red-500' : ''}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                {rateLimited && (
                  <div className="mt-2 text-sm">
                    <p>This is a security measure to prevent abuse. Please wait before trying again.</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !email.trim() || rateLimited}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending Reset Email...
              </>
            ) : (
              'Send Reset Email'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={onBackToSignIn}
            className="text-sm"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </div>

        <div className="mt-6 text-xs text-muted-foreground text-center space-y-2">
          <p><strong>Note:</strong> Make sure to check your spam folder if you don't see the email within a few minutes.</p>
          <p>The reset link will expire after 1 hour for security reasons.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordReset;
