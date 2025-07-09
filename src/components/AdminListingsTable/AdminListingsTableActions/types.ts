
import type { SBIRListing } from "@/types/listings";

export interface AdminListingsTableActionsProps {
  listing: SBIRListing;
  isProcessing: boolean;
  onEdit: (listing: SBIRListing) => void;
  onApprove: (listing: SBIRListing) => void;
  onReject: (listing: SBIRListing) => void;
  onHide: (listing: SBIRListing) => void;
  onDelete: (listing: SBIRListing) => void;
}

export interface BaseActionProps {
  listing: SBIRListing;
  isProcessing: boolean;
}
