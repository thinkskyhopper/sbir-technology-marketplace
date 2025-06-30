
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
      
      // First, let's verify the user exists and get their current state
      const { data: currentUser, error: fetchError } = await supabase
        .from('profiles')
        .select('id, can_submit_listings')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching current user:', fetchError);
        throw fetchError;
      }

      console.log('Current user state:', currentUser);

      // Now update the user's permission
      const { data, error } = await supabase
        .from('profiles')
        .update({ can_submit_listings: canSubmit })
        .eq('id', userId)
        .select('id, can_submit_listings')
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Database update result:', data);
      
      if (data) {
        console.log('Permission updated successfully. New value:', data.can_submit_listings);
        
        // Verify the update actually worked
        if (data.can_submit_listings !== canSubmit) {
          console.error('Database update failed - expected:', canSubmit, 'got:', data.can_submit_listings);
          throw new Error('Database update did not persist correctly');
        }
      }

      // Show success toast
      toast({
        title: "Success",
        description: `User submission permissions ${canSubmit ? 'enabled' : 'disabled'} successfully`,
      });

      // Invalidate and refetch the admin users query
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
