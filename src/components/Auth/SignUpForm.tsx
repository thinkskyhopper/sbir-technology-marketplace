
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SignUpFormFields from './SignUpFormFields';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

const SignUpForm = ({ onSwitchToSignIn }: SignUpFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!firstName.trim()) {
        setError('First name is required');
        setLoading(false);
        return;
      }

      if (!lastName.trim()) {
        setError('Last name is required');
        setLoading(false);
        return;
      }

      if (!privacyAccepted) {
        setError('You must agree to the Privacy Policy');
        setLoading(false);
        return;
      }

      if (!legalAccepted) {
        setError('You must agree to the Legal Disclaimer');
        setLoading(false);
        return;
      }
      
      // Create full name from first and last name
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      
      const { error } = await signUp(email, password, fullName, marketingOptIn);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Please check your email to confirm your account');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SignUpFormFields
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          privacyAccepted={privacyAccepted}
          setPrivacyAccepted={setPrivacyAccepted}
          legalAccepted={legalAccepted}
          setLegalAccepted={setLegalAccepted}
          marketingOptIn={marketingOptIn}
          setMarketingOptIn={setMarketingOptIn}
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-sm"
        >
          Already have an account? Sign in
        </Button>
      </div>
    </>
  );
};

export default SignUpForm;
