import { useState, useCallback, useMemo } from "react";
import type { SBIRListing } from "@/types/listings";

export const useBulkSelection = (visibleListings: SBIRListing[], allListings?: SBIRListing[]) => {
  const [selectedListings, setSelectedListings] = useState<Set<string>>(new Set());

  const selectedCount = selectedListings.size;
  const visibleCount = visibleListings.length;
  const visibleSelectedCount = visibleListings.filter(listing => selectedListings.has(listing.id)).length;
  const isAllVisibleSelected = visibleSelectedCount > 0 && visibleSelectedCount === visibleCount;
  const isIndeterminate = visibleSelectedCount > 0 && visibleSelectedCount < visibleCount;

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
    if (isAllVisibleSelected) {
      // Remove all visible listings from selection
      setSelectedListings(prev => {
        const newSelected = new Set(prev);
        visibleListings.forEach(listing => newSelected.delete(listing.id));
        return newSelected;
      });
    } else {
      // Add all visible listings to selection
      setSelectedListings(prev => {
        const newSelected = new Set(prev);
        visibleListings.forEach(listing => newSelected.add(listing.id));
        return newSelected;
      });
    }
  }, [visibleListings, isAllVisibleSelected]);

  const clearSelection = useCallback(() => {
    setSelectedListings(new Set());
  }, []);

  const isSelected = useCallback((listingId: string) => {
    return selectedListings.has(listingId);
  }, [selectedListings]);

  const selectedListingObjects = useMemo(() => {
    // Use allListings if available, otherwise fall back to visibleListings
    const sourceListings = allListings || visibleListings;
    return sourceListings.filter(listing => selectedListings.has(listing.id));
  }, [allListings, visibleListings, selectedListings]);

  return {
    selectedListings,
    selectedCount,
    totalCount: visibleCount,
    isAllSelected: isAllVisibleSelected,
    isIndeterminate,
    toggleListing,
    toggleAll,
    clearSelection,
    isSelected,
    selectedListingObjects,
  };
};