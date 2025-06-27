
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
  const lastNotifiedFilters = useRef<string>("");
  const isNotifyingParent = useRef(false);

  // Update local state when preservedFilters change, but only if we're not in the middle of notifying parent
  useEffect(() => {
    if (preservedFilters && !isNotifyingParent.current) {
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
        console.log('Syncing filters from URL:', preservedFilters);
        setLocalSearchQuery(preservedFilters.localSearchQuery);
        setPhaseFilter(preservedFilters.phaseFilter);
        setCategoryFilter(preservedFilters.categoryFilter);
        setStatusFilter(preservedFilters.statusFilter);
        setSortFilter(preservedFilters.sortFilter || "newest");
      }
    }
  }, [preservedFilters, localSearchQuery, phaseFilter, categoryFilter, statusFilter, sortFilter]);

  // Notify parent component when filters change, but avoid duplicate notifications
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    const currentFiltersString = JSON.stringify({
      localSearchQuery,
      phaseFilter,
      categoryFilter,
      statusFilter,
      sortFilter
    });

    // Only notify if filters actually changed and we have a callback
    if (currentFiltersString !== lastNotifiedFilters.current && onFiltersChange) {
      lastNotifiedFilters.current = currentFiltersString;
      
      // Set flag to prevent sync during notification
      isNotifyingParent.current = true;
      
      console.log('Notifying parent of filter change:', {
        localSearchQuery,
        phaseFilter,
        categoryFilter,
        statusFilter,
        sortFilter
      });
      
      onFiltersChange({
        localSearchQuery,
        phaseFilter,
        categoryFilter,
        statusFilter,
        sortFilter
      });
      
      // Reset flag after a short delay to allow URL update to complete
      setTimeout(() => {
        isNotifyingParent.current = false;
      }, 100);
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
