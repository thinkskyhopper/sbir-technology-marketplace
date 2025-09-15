// Public-safe listing interface that excludes admin-only sensitive data
export interface PublicSBIRListing {
  id: string;
  title: string;
  description: string;
  phase: 'Phase I' | 'Phase II' | 'Phase III';
  agency: string;
  value: number;
  deadline?: string;
  category: string;
  status: 'Active' | 'Pending' | 'Sold' | 'Rejected' | 'Hidden';
  submitted_at: string;
  approved_at?: string | null;
  user_id: string;
  photo_url?: string;
  date_sold?: string | null;
  technology_summary?: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

// Public-safe column list for database queries
export const PUBLIC_LISTING_COLUMNS = [
  'id',
  'title', 
  'description',
  'phase',
  'agency',
  'value',
  'deadline',
  'category',
  'status',
  'submitted_at',
  'approved_at',
  'user_id',
  'photo_url',
  'date_sold',
  'technology_summary',
  'created_at',
  'updated_at'
].join(', ');

// Admin-only sensitive columns that should never be exposed to public
export const ADMIN_ONLY_COLUMNS = [
  'agency_tracking_number',
  'contract',
  'proposal_award_date',
  'contract_end_date', 
  'topic_code',
  'company',
  'address',
  'primary_investigator_name',
  'pi_phone',
  'pi_email',
  'business_contact_name',
  'bc_phone',
  'bc_email'
];