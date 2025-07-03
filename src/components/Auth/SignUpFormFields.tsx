
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

interface SignUpFormFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  privacyAccepted: boolean;
  setPrivacyAccepted: (value: boolean) => void;
  legalAccepted: boolean;
  setLegalAccepted: (value: boolean) => void;
  marketingOptIn: boolean;
  setMarketingOptIn: (value: boolean) => void;
}

const SignUpFormFields = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  privacyAccepted,
  setPrivacyAccepted,
  legalAccepted,
  setLegalAccepted,
  marketingOptIn,
  setMarketingOptIn,
}: SignUpFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="John"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Doe"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
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
        <Label htmlFor="password">Password *</Label>
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

      <div className="space-y-4 pt-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="privacy"
            checked={privacyAccepted}
            onCheckedChange={setPrivacyAccepted}
            className="mt-1"
          />
          <Label htmlFor="privacy" className="text-sm leading-relaxed">
            I agree to the{' '}
            <Link 
              to="/privacy-policy" 
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            {' '}*
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="legal"
            checked={legalAccepted}
            onCheckedChange={setLegalAccepted}
            className="mt-1"
          />
          <Label htmlFor="legal" className="text-sm leading-relaxed">
            I agree to the{' '}
            <Link 
              to="/legal-disclaimer" 
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Legal Disclaimer
            </Link>
            {' '}*
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="marketing"
            checked={marketingOptIn}
            onCheckedChange={setMarketingOptIn}
            className="mt-1"
          />
          <Label htmlFor="marketing" className="text-sm leading-relaxed text-muted-foreground">
            I would like to receive marketing emails and newsletter updates (optional)
          </Label>
        </div>
      </div>
    </>
  );
};

export default SignUpFormFields;
