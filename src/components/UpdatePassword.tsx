
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock, Info } from 'lucide-react';
import { sanitizeErrorMessage } from '@/utils/errorMessages';
import { validatePassword, validatePasswordConfirmation } from '@/utils/validation';
import PasswordStrengthIndicator from '@/components/Auth/PasswordStrengthIndicator';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { updatePassword, signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || 'Invalid password');
      setLoading(false);
      return;
    }

    const confirmValidation = validatePasswordConfirmation(password, confirmPassword);
    if (!confirmValidation.isValid) {
      setError(confirmValidation.error || 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to update password');
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('Password update error:', error);
        setError(sanitizeErrorMessage(error, 'Update Password'));
      } else {
        setSuccess(true);
        console.log('Password updated successfully');
        
        // Auto-redirect after successful password update
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      console.error('Unexpected error during password update:', err);
      setError('An unexpected error occurred while updating your password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Password Updated Successfully!</CardTitle>
          <CardDescription>
            Your password has been updated. You will be redirected to the homepage shortly.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your password has been successfully updated. You can now use your new password to sign in.
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 text-center space-y-2">
            <Button onClick={() => navigate('/')} className="w-full">
              Continue to Homepage
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Update Your Password</CardTitle>
        <CardDescription>
          {user?.email ? `Updating password for ${user.email}` : 'Please enter your new password below'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your new password"
                disabled={loading}
                minLength={6}
                className={error && error.includes('Password must') ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {password && <PasswordStrengthIndicator password={password} />}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your new password"
                disabled={loading}
                minLength={6}
                className={error && error.includes('do not match') ? 'border-red-500' : ''}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !password || !confirmPassword}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={handleSignOut}
            className="text-sm"
            disabled={loading}
          >
            Cancel and Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdatePassword;
