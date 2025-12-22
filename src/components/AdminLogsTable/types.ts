
export interface AdminAuditLog {
  id: string;
  listing_id: string | null;
  listing_title: string;
  listing_agency: string;
  admin_id: string;
  action_type: 'approval' | 'denial' | 'edit' | 'deletion';
  internal_notes: string | null;
  user_notes: string | null;
  user_notified: boolean;
  changes_made: Record<string, any> | null;
  created_at: string;
  admin: {
    full_name: string | null;
    email: string;
  } | null;
  listing: {
    title: string;
    status: string;
    public_id?: string;
  } | null;
}
