
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { UserWithStats } from "./types";

export const useRoleChange = (users?: UserWithStats[]) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updatingRoleUsers, setUpdatingRoleUsers] = useState<Set<string>>(new Set());

  const handleRoleChange = async (userId: string, newRole: string) => {
    console.log('Starting role update for user:', userId, 'to:', newRole);
    
    // Add user to updating set to show loading state
    setUpdatingRoleUsers(prev => new Set(prev).add(userId));
    
    try {
      console.log('Updating role for user:', userId, 'to:', newRole);
      
      // First, let's verify the user exists and get their current state
      const { data: currentUser, error: fetchError } = await supabase
        .from('profiles')
        .select('id, role, email')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching current user:', fetchError);
        throw fetchError;
      }

      console.log('Current user state:', currentUser);

      // Try the update with more detailed logging
      console.log('Attempting database update...');
      const updateResult = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select('id, role, email');

      console.log('Raw update result:', updateResult);

      if (updateResult.error) {
        console.error('Database error:', updateResult.error);
        throw updateResult.error;
      }

      // Check if any rows were updated
      if (!updateResult.data || updateResult.data.length === 0) {
        console.error('No rows were updated');
        throw new Error('Failed to update user role - user not found');
      }
      
      const updatedUser = updateResult.data[0];
      console.log('Role updated successfully. New value:', updatedUser.role);
      
      // Verify the update actually worked
      if (updatedUser.role !== newRole) {
        console.error('Database update failed - expected:', newRole, 'got:', updatedUser.role);
        throw new Error('Database update did not persist correctly');
      }

      // Show success toast
      toast({
        title: "Success",
        description: `User role updated to ${newRole} successfully`,
      });

      // Invalidate and refetch the admin users query
      await queryClient.invalidateQueries({ 
        queryKey: ['admin-users'],
        exact: true
      });
      
      console.log('Query data refreshed successfully');
      
    } catch (error) {
      console.error('Error updating user role:', error);
      
      let errorMessage = "Failed to update user role";
      
      if (error instanceof Error) {
        if (error.message.includes('Insufficient permissions')) {
          errorMessage = "You don't have permission to update user roles";
        } else if (error.message.includes('RLS policy')) {
          errorMessage = "Database security policy prevented the update";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Remove user from updating set
      setUpdatingRoleUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  return {
    updatingRoleUsers,
    handleRoleChange
  };
};
