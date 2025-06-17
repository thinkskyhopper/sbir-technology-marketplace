
export interface SBIRListing {
  id: string;
  title: string;
  description: string;
  phase: 'Phase I' | 'Phase II';
  agency: string;
  value: number;
  deadline: string;
  category: string;
  status: 'Active' | 'Pending' | 'Sold' | 'Rejected';
  submitted_at: string;
  user_id: string;
  photo_url?: string;
}

export type ListingStatus = 'Active' | 'Pending' | 'Sold' | 'Rejected';
export type SBIRPhase = 'Phase I' | 'Phase II';

export type CreateListingData = Omit<SBIRListing, 'id' | 'submitted_at' | 'user_id'>;
export type UpdateListingData = Omit<SBIRListing, 'id' | 'submitted_at' | 'user_id'>;
