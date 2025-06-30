
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
        .select('id, can_submit_listings');

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Database update result:', data);
      
      if (data && data.length > 0) {
        console.log('Permission updated successfully. New value:', data[0].can_submit_listings);
      }

      // Show success toast
      toast({
        title: "Success",
        description: `User submission permissions ${canSubmit ? 'enabled' : 'disabled'} successfully`,
      });

      // Update the local query cache immediately
      queryClient.setQueryData(['admin-users'], (oldData: UserWithStats[] | undefined) => {
        if (!oldData) return oldData;
        
        return oldData.map(user => 
          user.id === userId 
            ? { ...user, can_submit_listings: canSubmit }
            : user
        );
      });
      
      // Also invalidate and refetch to ensure consistency
      await queryClient.invalidateQueries({ 
        queryKey: ['admin-users'],
        exact: true
      });
      
      console.log('Query data refreshed successfully');
      
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
