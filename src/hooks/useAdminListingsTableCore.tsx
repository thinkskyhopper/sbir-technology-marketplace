import { useEffect, useRef } from "react";
import { useOptimizedAdminListings } from "@/hooks/useOptimizedAdminListings";
import { useListingOperations } from "@/hooks/useListingOperations";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";
import { useAdminListingsTableState as useComponentState } from "@/hooks/useAdminListingsTableState";
import { useAdminListingsTableHandlers } from "@/hooks/useAdminListingsTableHandlers";
import { useListingChangeRequests } from "@/hooks/useListingChangeRequests";
import { useAdminListingsTableState, useAdminListingsTableLogic } from "@/components/AdminListingsTable/AdminListingsTableState";
import { useBulkSelection } from "@/hooks/useBulkSelection";
import { useBulkOperations } from "@/hooks/useBulkOperations";
import type { SBIRListing } from "@/types/listings";

export const useAdminListingsTableCore = () => {
  const persistedEditingListingId = useRef<string | null>(null);

  // Load persisted edit dialog state
  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin-edit-dialog-state');
      if (saved) {
        const { editingListingId, showDialog } = JSON.parse(saved);
        persistedEditingListingId.current = editingListingId;
      }
    } catch (error) {
      console.warn('Failed to load persisted edit dialog state:', error);
    }
  }, []);
  const { data, isLoading, error: queryError, invalidateAdminListings } = useOptimizedAdminListings();
  const listings = data || [];

  const { approveListing, rejectListing, hideListing, deleteListing } = useListingOperations(() => {
    invalidateAdminListings();
  });

  const loading = isLoading as boolean;
  const error = (queryError as any)?.message ?? null;
  
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
    typeFilter,
    setTypeFilter,
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
    categoryFilter,
    typeFilter
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
    selectedListings,
    setSelectedListings,
  } = useComponentState();

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

  // Bulk selection functionality (after pagination to access paginatedData)
  const bulkSelection = useBulkSelection(paginatedData, filteredListings);
  
  // Bulk operations
  const {
    bulkStatusChange,
    bulkDelete,
    loading: bulkLoading
  } = useBulkOperations(invalidateAdminListings);

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

  // Reset pagination when filters change - use useEffect to avoid infinite loops
  useEffect(() => {
    resetPagination();
  }, [searchTerm, statusFilter, phaseFilter, agencyFilter, categoryFilter, typeFilter]);

  // Clear bulk selection when filters change to avoid confusion
  useEffect(() => {
    bulkSelection.clearSelection();
  }, [searchTerm, statusFilter, phaseFilter, agencyFilter, categoryFilter, typeFilter, bulkSelection.clearSelection]);

  // Restore persisted edit dialog state when listings are available
  useEffect(() => {
    if (listings.length > 0 && persistedEditingListingId.current && !editingListing) {
      const listingToRestore = listings.find(l => l.id === persistedEditingListingId.current);
      if (listingToRestore) {
        setEditingListing(listingToRestore);
        setShowEditDialog(true);
        console.log('🔄 Restored edit dialog for listing:', listingToRestore.title);
      }
      // Clear the persisted state after attempting restoration
      persistedEditingListingId.current = null;
    }
  }, [listings, editingListing, setEditingListing, setShowEditDialog]);

  // Persist edit dialog state to localStorage
  useEffect(() => {
    try {
      if (editingListing && showEditDialog) {
        localStorage.setItem('admin-edit-dialog-state', JSON.stringify({
          editingListingId: editingListing.id,
          showDialog: true
        }));
      } else {
        localStorage.removeItem('admin-edit-dialog-state');
      }
    } catch (error) {
      console.warn('Failed to persist edit dialog state:', error);
    }
  }, [editingListing, showEditDialog]);

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
    typeFilter,
    setTypeFilter,
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
    
    // Bulk selection
    selectedCount: bulkSelection.selectedCount,
    totalCount: bulkSelection.totalCount,
    isAllSelected: bulkSelection.isAllSelected,
    isIndeterminate: bulkSelection.isIndeterminate,
    toggleListing: bulkSelection.toggleListing,
    toggleAll: bulkSelection.toggleAll,
    clearSelection: bulkSelection.clearSelection,
    isSelected: bulkSelection.isSelected,
    selectedListingObjects: bulkSelection.selectedListingObjects,
    
    // Bulk operations
    bulkStatusChange: async (newStatus: SBIRListing['status'], userNotes?: string, internalNotes?: string) => {
      await bulkStatusChange(bulkSelection.selectedListingObjects, newStatus, userNotes, internalNotes);
    },
    bulkDelete: async (userNotes?: string, internalNotes?: string) => {
      await bulkDelete(bulkSelection.selectedListingObjects, userNotes, internalNotes);
    },
    bulkOperationsLoading: bulkLoading,
    
    // Other
    refetchChangeRequests
  };
};
