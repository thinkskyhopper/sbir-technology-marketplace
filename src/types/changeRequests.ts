
export interface ListingChangeRequest {
  id: string;
  listing_id: string | null; // Now nullable since listings can be deleted
  user_id: string;
  request_type: 'change' | 'deletion';
  requested_changes?: any;
  reason?: string;
  user_reason?: string; // Add this property
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  admin_notes_for_user?: string; // New field for user-facing notes
  processed_by?: string;
  processed_by_admin_id?: string; // Add this property
  processed_at?: string;
  created_at: string;
  updated_at: string;
  // New fields to preserve listing information
  listing_title?: string;
  listing_agency?: string;
  // Add relationship data
  sbir_listings?: {
    title: string;
    agency: string;
  };
}

export type CreateChangeRequestData = {
  listing_id: string;
  request_type: 'change' | 'deletion';
  requested_changes?: any;
  reason?: string;
  listing_title?: string;
  listing_agency?: string;
};
