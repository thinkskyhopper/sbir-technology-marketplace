
export interface SBIRListing {
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
  // Deprecated fields (data migrated to title/description, kept in DB for backup)
  // internal_title?: string | null;
  // internal_description?: string | null;
  // New admin-only fields
  agency_tracking_number?: string | null;
  contract?: string | null;
  proposal_award_date?: string | null;
  contract_end_date?: string | null;
  topic_code?: string | null;
  company?: string | null;
  address?: string | null;
  primary_investigator_name?: string | null;
  pi_phone?: string | null;
  pi_email?: string | null;
  business_contact_name?: string | null;
  bc_phone?: string | null;
  bc_email?: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

export type ListingStatus = 'Active' | 'Pending' | 'Sold' | 'Rejected' | 'Hidden';
export type SBIRPhase = 'Phase I' | 'Phase II' | 'Phase III';

export type CreateListingData = Omit<SBIRListing, 'id' | 'submitted_at' | 'user_id' | 'deadline'> & {
  deadline?: string | null;
};
export type UpdateListingData = Omit<SBIRListing, 'id' | 'submitted_at' | 'user_id'>;
