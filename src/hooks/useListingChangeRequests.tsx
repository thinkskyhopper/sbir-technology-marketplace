
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ListingChangeRequestSummary {
  listing_id: string;
  pending_changes: number;
  pending_deletions: number;
  total_pending: number;
}

export const useListingChangeRequests = () => {
  const [requestSummaries, setRequestSummaries] = useState<ListingChangeRequestSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  const fetchChangeRequestSummaries = async () => {
    if (!isAdmin) return;

    try {
      setLoading(true);
      console.log('📊 Fetching change request summaries...');

      const { data, error } = await supabase
        .from('listing_change_requests')
        .select('listing_id, request_type')
        .eq('status', 'pending');

      if (error) {
        console.error('❌ Error fetching change request summaries:', error);
        throw error;
      }

      // Group by listing_id and count by request_type
      const summaries: { [key: string]: ListingChangeRequestSummary } = {};
      
      data?.forEach((request) => {
        if (!summaries[request.listing_id]) {
          summaries[request.listing_id] = {
            listing_id: request.listing_id,
            pending_changes: 0,
            pending_deletions: 0,
            total_pending: 0
          };
        }
        
        if (request.request_type === 'change') {
          summaries[request.listing_id].pending_changes++;
        } else if (request.request_type === 'deletion') {
          summaries[request.listing_id].pending_deletions++;
        }
        summaries[request.listing_id].total_pending++;
      });

      const summaryArray = Object.values(summaries);
      console.log('✅ Change request summaries fetched:', summaryArray.length);
      setRequestSummaries(summaryArray);
    } catch (err) {
      console.error('❌ Error fetching change request summaries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChangeRequestSummaries();
  }, [isAdmin]);

  const getListingRequestSummary = (listingId: string): ListingChangeRequestSummary | null => {
    return requestSummaries.find(summary => summary.listing_id === listingId) || null;
  };

  return {
    requestSummaries,
    loading,
    getListingRequestSummary,
    refetch: fetchChangeRequestSummaries
  };
};
