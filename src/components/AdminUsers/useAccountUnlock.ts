import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAccountUnlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.rpc('admin_unlock_user_account', {
        target_user_id: userId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Account unlocked successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      console.error('Error unlocking account:', error);
      toast.error('Failed to unlock account', {
        description: 'Please try again or contact support.'
      });
    }
  });
};
