
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
  const lastNotifiedFilters = useRef<string>("");

  // Update local state when preservedFilters change, but only if they're actually different
  useEffect(() => {
    if (preservedFilters) {
      const newFiltersString = JSON.stringify(preservedFilters);
      const currentFiltersString = JSON.stringify({
        localSearchQuery,
        phaseFilter,
        categoryFilter,
        statusFilter,
        sortFilter
      });

      // Only sync if the filters are actually different
      if (newFiltersString !== currentFiltersString) {
        isSyncingFromURL.current = true;
        setLocalSearchQuery(preservedFilters.localSearchQuery);
        setPhaseFilter(preservedFilters.phaseFilter);
        setCategoryFilter(preservedFilters.categoryFilter);
        setStatusFilter(preservedFilters.statusFilter);
        setSortFilter(preservedFilters.sortFilter || "newest");
        
        // Reset the flag after state updates
        setTimeout(() => {
          isSyncingFromURL.current = false;
        }, 0);
      }
    }
  }, [preservedFilters, localSearchQuery, phaseFilter, categoryFilter, statusFilter, sortFilter]);

  // Notify parent component when filters change, but avoid duplicate notifications
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (isSyncingFromURL.current) {
      return;
    }
    
    const currentFiltersString = JSON.stringify({
      localSearchQuery,
      phaseFilter,
      categoryFilter,
      statusFilter,
      sortFilter
    });

    // Only notify if filters actually changed
    if (currentFiltersString !== lastNotifiedFilters.current && onFiltersChange) {
      lastNotifiedFilters.current = currentFiltersString;
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
