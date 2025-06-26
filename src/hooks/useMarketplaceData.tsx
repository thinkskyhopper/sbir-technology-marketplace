
import { useState, useEffect } from "react";
import type { SBIRListing } from "@/types/listings";

interface UseMarketplaceDataProps {
  listings: SBIRListing[];
  searchQuery?: string;
  localSearchQuery: string;
  phaseFilter: string;
  categoryFilter: string;
  statusFilter: string;
  sortFilter: string;
  maxListings?: number;
  resetPagination: () => void;
}

export const useMarketplaceData = ({
  listings,
  searchQuery,
  localSearchQuery,
  phaseFilter,
  categoryFilter,
  statusFilter,
  sortFilter,
  maxListings,
  resetPagination
}: UseMarketplaceDataProps) => {
  const [filteredListings, setFilteredListings] = useState<SBIRListing[]>([]);

  const applyFilters = () => {
    let filtered = listings;

    // Apply search query (from prop or local)
    const query = searchQuery || localSearchQuery;
    if (query) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(query.toLowerCase()) ||
        listing.description.toLowerCase().includes(query.toLowerCase()) ||
        listing.agency.toLowerCase().includes(query.toLowerCase()) ||
        listing.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply phase filter
    if (phaseFilter !== "all") {
      filtered = filtered.filter(listing => listing.phase === phaseFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(listing => listing.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter === "active") {
      filtered = filtered.filter(listing => listing.status === "Active");
    } else if (statusFilter !== "all") {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    // Apply sorting
    if (sortFilter === "newest") {
      filtered = filtered.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    } else if (sortFilter === "oldest") {
      filtered = filtered.sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
    }

    // Apply maxListings limit if specified
    if (maxListings && maxListings > 0) {
      filtered = filtered.slice(0, maxListings);
    }

    setFilteredListings(filtered);
    // Reset pagination when filters change
    resetPagination();
  };

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [listings, searchQuery, localSearchQuery, phaseFilter, categoryFilter, statusFilter, sortFilter]);

  const categories = Array.from(new Set(listings.map(listing => listing.category)));

  return {
    filteredListings,
    categories
  };
};
