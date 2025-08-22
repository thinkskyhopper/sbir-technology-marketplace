
export interface ContactEmailRequest {
  name: string;
  email: string;
  company: string;
  referredBy?: string;
  interestLevel?: string;
  experience?: string;
  timeline?: string;
  message: string;
  howDidYouFindUs?: string;
  listing: {
    id: string;
    title: string;
    agency: string;
    value: number;
    phase: string;
  };
  userEmail: string;
}

export interface EmailResult {
  success: boolean;
  email: string;
  response?: any;
  error?: string;
}
