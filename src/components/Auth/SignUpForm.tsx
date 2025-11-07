
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SignUpFormFields from './SignUpFormFields';
import { validateName, validatePassword, validatePasswordConfirmation, validateEmail, sanitizeName } from '@/utils/validation';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
}

const SignUpForm = ({ onSwitchToSignIn }: SignUpFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [howDidYouHear, setHowDidYouHear] = useState('');
  const [howDidYouHearOther, setHowDidYouHearOther] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate first name
      const firstNameValidation = validateName(firstName, 'First name');
      if (!firstNameValidation.isValid) {
        setError(firstNameValidation.error!);
        setLoading(false);
        return;
      }

      // Validate last name
      const lastNameValidation = validateName(lastName, 'Last name');
      if (!lastNameValidation.isValid) {
        setError(lastNameValidation.error!);
        setLoading(false);
        return;
      }

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setError(emailValidation.error!);
        setLoading(false);
        return;
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.error!);
        setLoading(false);
        return;
      }

      // Validate password confirmation
      const passwordConfirmationValidation = validatePasswordConfirmation(password, confirmPassword);
      if (!passwordConfirmationValidation.isValid) {
        setError(passwordConfirmationValidation.error!);
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

      if (!howDidYouHear) {
        setError('Please tell us how you heard about us');
        setLoading(false);
        return;
      }

      if (howDidYouHear === 'Other (Please specify)' && !howDidYouHearOther.trim()) {
        setError('Please specify how you heard about us');
        setLoading(false);
        return;
      }
      
      // Create full name from sanitized first and last name
      const sanitizedFirstName = sanitizeName(firstName);
      const sanitizedLastName = sanitizeName(lastName);
      const fullName = `${sanitizedFirstName} ${sanitizedLastName}`;
      
      const { error, isDuplicate } = await signUp(email, password, fullName, marketingOptIn);
      
      if (error) {
        setError(error.message);
      } else if (isDuplicate) {
        setError('duplicate_email');
      } else {
        toast({
          title: "Account Created Successfully!",
          description: "Please check your email to confirm your account before signing in.",
        });
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
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          howDidYouHear={howDidYouHear}
          setHowDidYouHear={setHowDidYouHear}
          howDidYouHearOther={howDidYouHearOther}
          setHowDidYouHearOther={setHowDidYouHearOther}
          privacyAccepted={privacyAccepted}
          setPrivacyAccepted={setPrivacyAccepted}
          legalAccepted={legalAccepted}
          setLegalAccepted={setLegalAccepted}
          marketingOptIn={marketingOptIn}
          setMarketingOptIn={setMarketingOptIn}
          onSwitchToSignIn={onSwitchToSignIn}
        />

        <Alert className="bg-muted/50 border-muted-foreground/20">
          <Info className="h-4 w-4 text-muted-foreground" />
          <AlertDescription className="text-sm text-muted-foreground">
            After signing up, you'll receive a verification email. Please check your inbox and spam/junk folder. If you don't receive it within a few minutes, please contact support.
          </AlertDescription>
        </Alert>

        {error && error === 'duplicate_email' ? (
          <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <p className="font-medium mb-2">An account with this email already exists.</p>
              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onSwitchToSignIn}
                  className="border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900"
                >
                  Sign In Instead
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onSwitchToSignIn();
                    // Will trigger password reset flow - user can do this from sign in page
                  }}
                  className="border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900"
                >
                  Forgot Password?
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

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
