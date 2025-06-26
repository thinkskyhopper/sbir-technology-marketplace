
import { useState, useEffect, useRef } from "react";

interface UseMarketplaceFiltersProps {
  preservedFilters?: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
    sortFilter: string;
  };
  onFiltersChange?: (filters: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
    sortFilter: string;
  }) => void;
}

export const useMarketplaceFilters = ({
  preservedFilters,
  onFiltersChange
}: UseMarketplaceFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(preservedFilters?.localSearchQuery || "");
  const [phaseFilter, setPhaseFilter] = useState<string>(preservedFilters?.phaseFilter || "all");
  const [categoryFilter, setCategoryFilter] = useState<string>(preservedFilters?.categoryFilter || "all");
  const [statusFilter, setStatusFilter] = useState<string>(preservedFilters?.statusFilter || "active");
  const [sortFilter, setSortFilter] = useState<string>(preservedFilters?.sortFilter || "newest");
  const isInitialMount = useRef(true);
  const isSyncingFromURL = useRef(false);

  // Update local state when preservedFilters change
  useEffect(() => {
    if (preservedFilters) {
      isSyncingFromURL.current = true;
      setLocalSearchQuery(preservedFilters.localSearchQuery);
      setPhaseFilter(preservedFilters.phaseFilter);
      setCategoryFilter(preservedFilters.categoryFilter);
      setStatusFilter(preservedFilters.statusFilter);
      setSortFilter(preservedFilters.sortFilter || "newest");
      // Reset the flag after a brief delay to allow state updates to complete
      setTimeout(() => {
        isSyncingFromURL.current = false;
      }, 0);
    }
  }, [preservedFilters]);

  // Notify parent component when filters change, but skip initial mount and URL sync
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (isSyncingFromURL.current) {
      return;
    }
    
    if (onFiltersChange) {
      onFiltersChange({
        localSearchQuery,
        phaseFilter,
        categoryFilter,
        statusFilter,
        sortFilter
      });
    }
  }, [localSearchQuery, phaseFilter, categoryFilter, statusFilter, sortFilter, onFiltersChange]);

  const handleClearFilters = () => {
    setLocalSearchQuery("");
    setPhaseFilter("all");
    setCategoryFilter("all");
    setStatusFilter("active");
    setSortFilter("newest");
  };

  return {
    localSearchQuery,
    setLocalSearchQuery,
    phaseFilter,
    setPhaseFilter,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sortFilter,
    setSortFilter,
    handleClearFilters
  };
};
