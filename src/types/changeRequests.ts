
export interface ListingChangeRequest {
  id: string;
  listing_id: string;
  user_id: string;
  request_type: 'change' | 'deletion';
  requested_changes?: any;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export type CreateChangeRequestData = {
  listing_id: string;
  request_type: 'change' | 'deletion';
  requested_changes?: any;
  reason?: string;
};
