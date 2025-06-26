
export interface ChangeRequestNotificationRequest {
  changeRequest: {
    id: string;
    listing_id: string;
    request_type: 'change' | 'deletion';
    requested_changes?: any;
    reason?: string;
    sbir_listings?: {
      title: string;
      agency: string;
    };
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
