
export interface ListingChangeRequest {
  id: string;
  listing_id: string | null; // Now nullable since listings can be deleted
  user_id: string;
  request_type: 'change' | 'deletion';
  requested_changes?: any;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  admin_notes_for_user?: string; // New field for user-facing notes
  processed_by?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  // New fields to preserve listing information
  listing_title?: string;
  listing_agency?: string;
}

export type CreateChangeRequestData = {
  listing_id: string;
  request_type: 'change' | 'deletion';
  requested_changes?: any;
  reason?: string;
};
