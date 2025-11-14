
import { useState, useEffect, useRef } from "react";

interface UseMarketplaceFiltersProps {
  preservedFilters?: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
    sortFilter: string;
    typeFilter: string;
  };
  onFiltersChange?: (filters: {
    localSearchQuery: string;
    phaseFilter: string;
    categoryFilter: string;
    statusFilter: string;
    sortFilter: string;
    typeFilter: string;
  }) => void;
}

export const useMarketplaceFilters = ({
  preservedFilters,
  onFiltersChange
}: UseMarketplaceFiltersProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(preservedFilters?.localSearchQuery || "");
  const [phaseFilter, setPhaseFilter] = useState<string>(preservedFilters?.phaseFilter || "all");
  const [categoryFilter, setCategoryFilter] = useState<string>(preservedFilters?.categoryFilter || "all");
  const [statusFilter, setStatusFilter] = useState<string>(preservedFilters?.statusFilter || "all"); // Changed from "active" to "all"
  const [sortFilter, setSortFilter] = useState<string>(preservedFilters?.sortFilter || "newest");
  const [typeFilter, setTypeFilter] = useState<string>(preservedFilters?.typeFilter || "all");
  const isInitialMount = useRef(true);
  const lastNotifiedFilters = useRef<string>("");
  const hasUserInteracted = useRef(false);
  const [isFiltersReady, setIsFiltersReady] = useState(false);

  // Only sync from URL on initial mount or when user hasn't interacted yet
  useEffect(() => {
    if (preservedFilters && (!hasUserInteracted.current || isInitialMount.current)) {
      console.log('Initial sync from URL:', preservedFilters);
      setLocalSearchQuery(preservedFilters.localSearchQuery);
      setPhaseFilter(preservedFilters.phaseFilter);
      setCategoryFilter(preservedFilters.categoryFilter);
      setStatusFilter(preservedFilters.statusFilter);
      setSortFilter(preservedFilters.sortFilter || "newest");
      setTypeFilter(preservedFilters.typeFilter || "all");
      
      if (isInitialMount.current) {
        isInitialMount.current = false;
      }
    }
    
    // Mark filters as ready after initial sync
    const timer = setTimeout(() => {
      setIsFiltersReady(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [preservedFilters]);

  // Notify parent component when filters change, but avoid duplicate notifications
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }
    
    const currentFiltersString = JSON.stringify({
      localSearchQuery,
      phaseFilter,
      categoryFilter,
      statusFilter,
      sortFilter,
      typeFilter
    });

    // Only notify if filters actually changed and we have a callback
    if (currentFiltersString !== lastNotifiedFilters.current && onFiltersChange) {
      lastNotifiedFilters.current = currentFiltersString;
      
      console.log('Notifying parent of filter change:', {
        localSearchQuery,
        phaseFilter,
        categoryFilter,
        statusFilter,
        sortFilter,
        typeFilter
      });
      
      onFiltersChange({
        localSearchQuery,
        phaseFilter,
        categoryFilter,
        statusFilter,
        sortFilter,
        typeFilter
      });
    }
  }, [localSearchQuery, phaseFilter, categoryFilter, statusFilter, sortFilter, typeFilter, onFiltersChange]);

  const handleSetLocalSearchQuery = (query: string) => {
    hasUserInteracted.current = true;
    setLocalSearchQuery(query);
  };

  const handleSetPhaseFilter = (phase: string) => {
    hasUserInteracted.current = true;
    setPhaseFilter(phase);
  };

  const handleSetCategoryFilter = (category: string) => {
    hasUserInteracted.current = true;
    setCategoryFilter(category);
  };

  const handleSetStatusFilter = (status: string) => {
    hasUserInteracted.current = true;
    setStatusFilter(status);
  };

  const handleSetSortFilter = (sort: string) => {
    hasUserInteracted.current = true;
    setSortFilter(sort);
  };

  const handleSetTypeFilter = (type: string) => {
    hasUserInteracted.current = true;
    setTypeFilter(type);
  };

  const handleClearFilters = () => {
    hasUserInteracted.current = true;
    setLocalSearchQuery("");
    setPhaseFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all"); // Changed from "active" to "all"
    setSortFilter("newest");
    setTypeFilter("all");
  };

  return {
    localSearchQuery,
    setLocalSearchQuery: handleSetLocalSearchQuery,
    phaseFilter,
    setPhaseFilter: handleSetPhaseFilter,
    categoryFilter,
    setCategoryFilter: handleSetCategoryFilter,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
    sortFilter,
    setSortFilter: handleSetSortFilter,
    typeFilter,
    setTypeFilter: handleSetTypeFilter,
    handleClearFilters,
    isFiltersReady
  };
};
