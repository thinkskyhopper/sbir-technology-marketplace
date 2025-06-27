
export interface ChangeRequestStatusNotificationRequest {
  changeRequest: {
    id: string;
    status: 'approved' | 'rejected';
    request_type: 'change' | 'deletion';
    admin_notes_for_user?: string;
    listing_title?: string;
    listing_agency?: string;
    created_at: string;
    processed_at?: string;
  };
  userEmail: string;
  userName: string;
}

export interface EmailResult {
  success: boolean;
  email: string;
  response?: any;
  error?: string;
}
