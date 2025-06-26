
export interface AdminNotificationRequest {
  listing: {
    id: string;
    title: string;
    agency: string;
    value: number;
    phase: string;
    category: string;
    description: string;
  };
  submitterName: string;
  submitterEmail: string;
}

export interface EmailResult {
  success: boolean;
  email: string;
  response?: any;
  error?: string;
}

export interface AdminProfile {
  email: string;
  full_name: string;
}
