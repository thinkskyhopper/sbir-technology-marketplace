
import type { SBIRPhase, ListingStatus } from "@/types/listings";

export interface ParsedListing {
  title: string;
  description: string;
  agency: string;
  phase: SBIRPhase;
  value: number;
  deadline: string;
  category: string;
  photo_url?: string;
  status: ListingStatus;
  rowNumber: number;
}
