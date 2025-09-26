import { useState, useCallback, useMemo } from "react";
import type { SBIRListing } from "@/types/listings";

export const useBulkSelection = (listings: SBIRListing[]) => {
  const [selectedListings, setSelectedListings] = useState<Set<string>>(new Set());

  const selectedCount = selectedListings.size;
  const totalCount = listings.length;
  const isAllSelected = selectedCount > 0 && selectedCount === totalCount;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  const toggleListing = useCallback((listingId: string) => {
    setSelectedListings(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(listingId)) {
        newSelected.delete(listingId);
      } else {
        newSelected.add(listingId);
      }
      return newSelected;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedListings(new Set());
    } else {
      setSelectedListings(new Set(listings.map(listing => listing.id)));
    }
  }, [listings, isAllSelected]);

  const clearSelection = useCallback(() => {
    setSelectedListings(new Set());
  }, []);

  const isSelected = useCallback((listingId: string) => {
    return selectedListings.has(listingId);
  }, [selectedListings]);

  const selectedListingObjects = useMemo(() => {
    return listings.filter(listing => selectedListings.has(listing.id));
  }, [listings, selectedListings]);

  return {
    selectedListings,
    selectedCount,
    totalCount,
    isAllSelected,
    isIndeterminate,
    toggleListing,
    toggleAll,
    clearSelection,
    isSelected,
    selectedListingObjects,
  };
};