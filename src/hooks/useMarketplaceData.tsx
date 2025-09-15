
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
}

export const useMarketplaceData = ({
  listings,
  searchQuery,
  localSearchQuery,
  phaseFilter,
  categoryFilter,
  statusFilter,
  sortFilter,
  maxListings
}: UseMarketplaceDataProps) => {
  const [filteredListings, setFilteredListings] = useState<SBIRListing[]>([]);
  const [shouldResetPagination, setShouldResetPagination] = useState(false);

  const applyFilters = () => {
    // Don't filter if listings are empty (might be loading)
    if (!listings || listings.length === 0) {
      setFilteredListings([]);
      setShouldResetPagination(true);
      return;
    }
    
    let filtered = listings.slice();

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

    // Apply status filter - modified to only show Active and Sold for "all"
    if (statusFilter === "active") {
      filtered = filtered.filter(listing => listing.status === "Active");
    } else if (statusFilter === "Sold") {
      filtered = filtered.filter(listing => listing.status === "Sold");
    } else if (statusFilter === "all") {
      // Only show Active and Sold listings, exclude Pending, Rejected, and Hidden
      filtered = filtered.filter(listing => 
        listing.status === "Active" || listing.status === "Sold"
      );
    }

    // Apply sorting (avoid mutating original array)
    if (sortFilter === "newest") {
      filtered = [...filtered].sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    } else if (sortFilter === "oldest") {
      filtered = [...filtered].sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
    }

    // Apply maxListings limit if specified
    if (maxListings && maxListings > 0) {
      filtered = filtered.slice(0, maxListings);
    }

    setFilteredListings(filtered);
    // Signal that pagination should be reset
    setShouldResetPagination(true);
  };

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [listings, searchQuery, localSearchQuery, phaseFilter, categoryFilter, statusFilter, sortFilter, maxListings]);

  const categories = Array.from(new Set(listings.map(listing => listing.category)));

  // Reset the pagination reset flag after it's been consumed
  const consumePaginationReset = () => {
    setShouldResetPagination(false);
  };

  return {
    filteredListings,
    categories,
    shouldResetPagination,
    consumePaginationReset
  };
};
