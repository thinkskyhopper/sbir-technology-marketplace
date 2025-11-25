import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AffiliateUser {
  id: string;
  full_name: string | null;
  email: string;
  photo_url?: string | null;
}

export const useAffiliateUsers = () => {
  return useQuery({
    queryKey: ['affiliate-users'],
    queryFn: async () => {
      console.log('📊 Fetching affiliate users...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'affiliate')
        .eq('account_deleted', false)
        .order('full_name');

      if (error) {
        console.error('❌ Error fetching affiliate users:', error);
        throw error;
      }

      console.log('✅ Fetched affiliate users:', data?.length);
      return data as AffiliateUser[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
