
import type { SBIRPhase, ListingStatus } from "@/types/listings";

export interface ParsedListing {
  title: string;
  description: string;
  agency: string;
  phase: SBIRPhase;
  value: number;
  deadline?: string;
  category: string;
  photo_url?: string;
  status: ListingStatus;
  rowNumber: number;
  // Optional fields that can be included in CSV
  technology_summary?: string;
  agency_tracking_number?: string;
  contract?: string;
  proposal_award_date?: string;
  contract_end_date?: string;
  topic_code?: string;
  company?: string;
  address?: string;
  primary_investigator_name?: string;
  pi_phone?: string;
  pi_email?: string;
  business_contact_name?: string;
  bc_phone?: string;
  bc_email?: string;
}
