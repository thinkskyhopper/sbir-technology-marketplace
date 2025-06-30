
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { UserWithStats } from "./types";

export const usePermissionChange = (users?: UserWithStats[]) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());

  const handleSubmissionPermissionChange = async (userId: string, canSubmit: boolean) => {
    console.log('Starting permission update for user:', userId, 'to:', canSubmit);
    
    // Add user to updating set to show loading state
    setUpdatingUsers(prev => new Set(prev).add(userId));
    
    try {
      console.log('Updating submission permissions for user:', userId, 'to:', canSubmit);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ can_submit_listings: canSubmit })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Database update result:', data);
      console.log('Successfully updated submission permissions');

      // Show success toast without custom duration to allow auto-dismiss
      toast({
        title: "Success",
        description: `User submission permissions ${canSubmit ? 'enabled' : 'disabled'} successfully`,
      });

      // Force refresh the query data
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      await queryClient.refetchQueries({ queryKey: ['admin-users'] });
      console.log('Query invalidated and refetched');
      
    } catch (error) {
      console.error('Error updating submission permissions:', error);
      toast({
        title: "Error",
        description: "Failed to update user permissions",
        variant: "destructive",
      });
    } finally {
      // Remove user from updating set
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  return {
    updatingUsers,
    handleSubmissionPermissionChange
  };
};
