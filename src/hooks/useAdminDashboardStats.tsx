
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminDashboardStats {
  pendingChangeRequests: number;
  pendingListings: number;
  loading: boolean;
}

export const useAdminDashboardStats = (): AdminDashboardStats => {
  const [stats, setStats] = useState<AdminDashboardStats>({
    pendingChangeRequests: 0,
    pendingListings: 0,
    loading: true
  });
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) return;

    const fetchStats = async () => {
      try {
        // Fetch pending change requests
        const { count: changeRequestsCount } = await supabase
          .from('listing_change_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Fetch pending listings
        const { count: listingsCount } = await supabase
          .from('sbir_listings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Pending');

        setStats({
          pendingChangeRequests: changeRequestsCount || 0,
          pendingListings: listingsCount || 0,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, [isAdmin]);

  return stats;
};
