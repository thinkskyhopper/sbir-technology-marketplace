
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { UserWithStats } from "./types";
import { sanitizeErrorMessage } from "@/utils/errorMessages";

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
        .select('id, can_submit_listings, role')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching current user:', fetchError);
        throw fetchError;
      }

      console.log('Current user state:', currentUser);

      // Check if user is admin (admins should always have can_submit_listings = true)
      if (currentUser.role === 'admin' && !canSubmit) {
        console.log('Cannot disable submission for admin users');
        toast({
          title: "Cannot Update",
          description: "Admin users must always have submission permissions enabled.",
          variant: "destructive",
        });
        return;
      }

      // Try the update with more detailed logging
      console.log('Attempting database update...');
      const updateResult = await supabase
        .from('profiles')
        .update({ can_submit_listings: canSubmit })
        .eq('id', userId)
        .select('id, can_submit_listings, role');

      console.log('Raw update result:', updateResult);

      if (updateResult.error) {
        console.error('Database error:', updateResult.error);
        throw updateResult.error;
      }

      // Check if any rows were updated
      if (!updateResult.data || updateResult.data.length === 0) {
        console.error('No rows were updated - this should not happen with the new RLS policy');
        throw new Error('Failed to update user permissions - unexpected database issue');
      }
      
      const updatedUser = updateResult.data[0];
      console.log('Permission updated successfully. New value:', updatedUser.can_submit_listings);
      
      // Verify the update actually worked
      if (updatedUser.can_submit_listings !== canSubmit) {
        console.error('Database update failed - expected:', canSubmit, 'got:', updatedUser.can_submit_listings);
        throw new Error('Database update did not persist correctly');
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
        description: sanitizeErrorMessage(error, 'Permission Update'),
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
