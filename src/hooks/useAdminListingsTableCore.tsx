import { useEffect } from "react";
import { useListings } from "@/hooks/useListings";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";
import { useAdminListingsTableState as useComponentState } from "@/hooks/useAdminListingsTableState";
import { useAdminListingsTableHandlers } from "@/hooks/useAdminListingsTableHandlers";
import { useListingChangeRequests } from "@/hooks/useListingChangeRequests";
import { useAdminListingsTableState, useAdminListingsTableLogic } from "@/components/AdminListingsTable/AdminListingsTableState";

export const useAdminListingsTableCore = () => {
  const { listings, loading, error, approveListing, rejectListing, hideListing, deleteListing } = useListings();
  
  // Filter and search state
  const {
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
  } = useAdminListingsTableState();

  // Business logic
  const { filteredListings, uniqueAgencies } = useAdminListingsTableLogic(
    listings,
    searchTerm,
    statusFilter,
    phaseFilter,
    agencyFilter,
    categoryFilter
  );
  
  const {
    processingId,
    setProcessingId,
    editingListing,
    setEditingListing,
    showEditDialog,
    setShowEditDialog,
    confirmAction,
    setConfirmAction,
  } = useComponentState();

  const {
    handleEdit,
    handleApproveClick,
    handleRejectClick,
    handleHideClick,
    handleDeleteClick,
    handleConfirmAction,
  } = useAdminListingsTableHandlers({
    approveListing,
    rejectListing,
    hideListing,
    deleteListing,
    setProcessingId,
    setEditingListing,
    setShowEditDialog,
    setConfirmAction,
    confirmAction,
  });

  // Add sorting functionality
  const { sortedData: sortedListings, sortState, handleSort } = useSorting(filteredListings, {
    column: 'submitted_at',
    direction: 'desc'
  });

  // Add pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    totalItems,
    resetPagination
  } = usePagination({
    data: sortedListings,
    itemsPerPage: 10
  });

  // Reset pagination when filters change - use useEffect to avoid infinite loops
  useEffect(() => {
    resetPagination();
  }, [searchTerm, statusFilter, phaseFilter, agencyFilter, categoryFilter]);

  // Load change request data for indicators (optimized to avoid repeated calls)
  const { refetch: refetchChangeRequests } = useListingChangeRequests();

  return {
    // Data
    listings,
    filteredListings,
    paginatedData,
    uniqueAgencies,
    
    // State
    loading,
    error,
    processingId,
    editingListing,
    showEditDialog,
    setShowEditDialog,
    confirmAction,
    setConfirmAction,
    
    // Filter state
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
    
    // Sorting and pagination
    sortState,
    handleSort,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    totalItems,
    
    // Handlers
    handleEdit,
    handleApproveClick,
    handleRejectClick,
    handleHideClick,
    handleDeleteClick,
    handleConfirmAction,
    
    // Other
    refetchChangeRequests
  };
};
