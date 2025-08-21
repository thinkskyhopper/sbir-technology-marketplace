
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PolicyDialog from './PolicyDialog';

interface SignUpFormFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  howDidYouHear: string;
  setHowDidYouHear: (value: string) => void;
  howDidYouHearOther: string;
  setHowDidYouHearOther: (value: string) => void;
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
  howDidYouHear,
  setHowDidYouHear,
  howDidYouHearOther,
  setHowDidYouHearOther,
  privacyAccepted,
  setPrivacyAccepted,
  legalAccepted,
  setLegalAccepted,
  marketingOptIn,
  setMarketingOptIn,
}: SignUpFormFieldsProps) => {
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [legalDialogOpen, setLegalDialogOpen] = useState(false);

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

      <div className="space-y-2">
        <Label htmlFor="howDidYouHear">How did you hear about us? *</Label>
        <Select value={howDidYouHear} onValueChange={setHowDidYouHear}>
          <SelectTrigger>
            <SelectValue placeholder="Please select how you heard about us" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Google">Google</SelectItem>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="Podcast">Podcast</SelectItem>
            <SelectItem value="Word of mouth">Word of mouth</SelectItem>
            <SelectItem value="Other (Please specify)">Other (Please specify)</SelectItem>
          </SelectContent>
        </Select>
        
        {howDidYouHear === 'Other (Please specify)' && (
          <div className="mt-2">
            <Input
              id="howDidYouHearOther"
              type="text"
              value={howDidYouHearOther}
              onChange={(e) => setHowDidYouHearOther(e.target.value)}
              placeholder="Please tell us how you heard about us"
              required
            />
          </div>
        )}
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
            <button
              type="button"
              onClick={() => setPrivacyDialogOpen(true)}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Privacy Policy
            </button>
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
            <button
              type="button"
              onClick={() => setLegalDialogOpen(true)}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Legal Disclaimer
            </button>
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

      <PolicyDialog
        open={privacyDialogOpen}
        onOpenChange={setPrivacyDialogOpen}
        title="Privacy Policy"
        type="privacy"
      />

      <PolicyDialog
        open={legalDialogOpen}
        onOpenChange={setLegalDialogOpen}
        title="Legal Disclaimer"
        type="legal"
      />
    </>
  );
};

export default SignUpFormFields;
