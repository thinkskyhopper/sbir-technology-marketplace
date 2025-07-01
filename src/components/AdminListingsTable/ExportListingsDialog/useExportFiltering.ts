
import { useMemo } from "react";
import type { SBIRListing } from "@/types/listings";
import type { ExportFilters } from "./types";

export const useExportFiltering = (listings: SBIRListing[], filters: ExportFilters) => {
  return useMemo(() => {
    return listings.filter(listing => {
      const matchesStatus = filters.status === "all" || listing.status === filters.status;
      const matchesPhase = filters.phase === "all" || listing.phase === filters.phase;
      const matchesAgency = filters.agency === "all" || listing.agency === filters.agency;
      const matchesCategory = filters.category === "all" || listing.category === filters.category;
      
      const matchesSearch = !filters.searchTerm || 
        listing.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        listing.agency.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        listing.category.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesMinValue = !filters.minValue || listing.value >= parseFloat(filters.minValue);
      const matchesMaxValue = !filters.maxValue || listing.value <= parseFloat(filters.maxValue);

      const listingDate = new Date(listing.submitted_at);
      const matchesFromDate = !filters.dateFrom || listingDate >= new Date(filters.dateFrom);
      const matchesToDate = !filters.dateTo || listingDate <= new Date(filters.dateTo);

      return matchesStatus && matchesPhase && matchesAgency && matchesCategory && 
             matchesSearch && matchesMinValue && matchesMaxValue && 
             matchesFromDate && matchesToDate;
    });
  }, [listings, filters]);
};
