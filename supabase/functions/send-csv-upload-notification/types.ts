
export interface CSVUploadDetails {
  fileName: string;
  listingCount: number;
  uploadedBy: string;
  uploaderEmail: string;
}

export interface CSVUploadNotificationRequest {
  uploadDetails: CSVUploadDetails;
}

export interface EmailResult {
  success: boolean;
  email: string;
  response?: any;
  error?: string;
}

export interface AdminProfile {
  email: string;
  full_name: string | null;
}
