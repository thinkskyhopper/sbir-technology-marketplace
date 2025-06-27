
import { useState, useMemo } from "react";
import type { SBIRListing } from "@/types/listings";

export const useAdminListingsTableState = () => {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [agencyFilter, setAgencyFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Clear all filters helper
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPhaseFilter("all");
    setAgencyFilter("all");
    setCategoryFilter("all");
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || phaseFilter !== "all" || agencyFilter !== "all" || categoryFilter !== "all";

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    phaseFilter,
    setPhaseFilter,
    agencyFilter,
    setAgencyFilter,
    categoryFilter,
    setCategoryFilter,
    handleClearFilters,
    hasActiveFilters,
  };
};

export const useAdminListingsTableLogic = (
  listings: SBIRListing[],
  searchTerm: string,
  statusFilter: string,
  phaseFilter: string,
  agencyFilter: string,
  categoryFilter: string
) => {
  // Filter and search listings
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesSearch = searchTerm === "" || 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
      const matchesPhase = phaseFilter === "all" || listing.phase === phaseFilter;
      const matchesAgency = agencyFilter === "all" || listing.agency === agencyFilter;
      const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesPhase && matchesAgency && matchesCategory;
    });
  }, [listings, searchTerm, statusFilter, phaseFilter, agencyFilter, categoryFilter]);

  // Get unique agencies for filter dropdown
  const uniqueAgencies = useMemo(() => {
    const agencies = [...new Set(listings.map(listing => listing.agency))];
    return agencies.sort();
  }, [listings]);

  return {
    filteredListings,
    uniqueAgencies,
  };
};
