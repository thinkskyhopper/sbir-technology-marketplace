import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listingsService } from '@/services/listingsService';
import { useToast } from '@/hooks/use-toast';
import type { SBIRListing } from '@/types/listings';

export const useBulkOperations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const processBulkOperation = async (
    listings: SBIRListing[],
    operation: (listingId: string, adminId: string, userNotes?: string, internalNotes?: string) => Promise<void>,
    operationName: string,
    userNotes?: string,
    internalNotes?: string
  ) => {
    if (!isAdmin || !user) {
      throw new Error(`Only admins can perform bulk ${operationName.toLowerCase()}`);
    }

    if (listings.length === 0) {
      return { successful: 0, failed: 0, errors: [] };
    }

    setLoading(true);
    const results = { successful: 0, failed: 0, errors: [] as string[] };

    try {
      // Process in batches of 10 to avoid overwhelming the server
      const batchSize = 10;
      const batches = [];
      for (let i = 0; i < listings.length; i += batchSize) {
        batches.push(listings.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const promises = batch.map(async (listing) => {
          try {
            await operation(listing.id, user.id, userNotes, internalNotes);
            results.successful++;
          } catch (error) {
            results.failed++;
            results.errors.push(`${listing.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        });

        await Promise.allSettled(promises);
      }

      // Show results toast
      if (results.failed === 0) {
        toast({
          title: "Bulk Operation Successful",
          description: `Successfully ${operationName.toLowerCase()}ed ${results.successful} listing${results.successful !== 1 ? 's' : ''}.`,
        });
      } else {
        toast({
          title: "Bulk Operation Completed with Errors",
          description: `${results.successful} successful, ${results.failed} failed. Check details for errors.`,
          variant: "destructive",
        });
      }

      if (onSuccess) onSuccess();
      return results;
    } finally {
      setLoading(false);
    }
  };

  const bulkApprove = async (listings: SBIRListing[], userNotes?: string, internalNotes?: string) => {
    return processBulkOperation(
      listings.filter(l => l.status !== 'Active'),
      listingsService.approveListing,
      'Approve',
      userNotes,
      internalNotes
    );
  };

  const bulkReject = async (listings: SBIRListing[], userNotes?: string, internalNotes?: string) => {
    return processBulkOperation(
      listings.filter(l => l.status !== 'Rejected'),
      listingsService.rejectListing,
      'Reject',
      userNotes,
      internalNotes
    );
  };

  const bulkHide = async (listings: SBIRListing[], userNotes?: string, internalNotes?: string) => {
    return processBulkOperation(
      listings.filter(l => l.status !== 'Hidden'),
      listingsService.hideListing,
      'Hide',
      userNotes,
      internalNotes
    );
  };

  const bulkDelete = async (listings: SBIRListing[], userNotes?: string, internalNotes?: string) => {
    return processBulkOperation(
      listings,
      listingsService.deleteListing,
      'Delete',
      userNotes,
      internalNotes
    );
  };

  return {
    bulkApprove,
    bulkReject,
    bulkHide,
    bulkDelete,
    loading
  };
};