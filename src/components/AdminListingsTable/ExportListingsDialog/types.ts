
import type { SBIRListing } from "@/types/listings";

export interface ExportFilters {
  status: string;
  phase: string;
  agency: string;
  category: string;
  minValue: string;
  maxValue: string;
  dateFrom: string;
  dateTo: string;
  searchTerm: string;
}

export interface ExportFields {
  title: boolean;
  description: boolean;
  agency: boolean;
  phase: boolean;
  value: boolean;
  deadline: boolean;
  category: boolean;
  status: boolean;
  submittedAt: boolean;
  userInfo: boolean;
  photoUrl: boolean;
  dateSold: boolean;
}

export interface ExportFiltersProps {
  filters: ExportFilters;
  setFilters: React.Dispatch<React.SetStateAction<ExportFilters>>;
  listings: SBIRListing[];
  uniqueAgencies: string[];
  filteredListings: SBIRListing[];
}

export interface ExportOptionsProps {
  exportFormat: "csv" | "json";
  setExportFormat: (format: "csv" | "json") => void;
  exportFields: ExportFields;
  setExportFields: React.Dispatch<React.SetStateAction<ExportFields>>;
}
