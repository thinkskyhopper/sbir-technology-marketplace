
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { UserWithStats } from "./types";

type UserRole = "admin" | "user" | "consultant" | "verified";

export const useRoleChange = (users?: UserWithStats[]) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updatingRoles, setUpdatingRoles] = useState<Set<string>>(new Set());

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    console.log('Starting role update for user:', userId, 'to:', newRole);
    
    // Add user to updating set to show loading state
    setUpdatingRoles(prev => new Set(prev).add(userId));
    
    try {
      console.log('Calling secure change_user_role function...');
      
      // Use the secure RPC function to change user role
      const { error } = await supabase.rpc('change_user_role', {
        target_user_id: userId,
        new_role: newRole
      });

      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }

      console.log('Role updated successfully via RPC function');

      // Show success toast with 5 second auto-dismiss
      toast({
        title: "Success",
        description: `User role updated to ${newRole} successfully`,
        duration: 5000,
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
        if (error.message.includes('Only administrators')) {
          errorMessage = "You don't have permission to update user roles";
        } else {
          errorMessage = error.message;
        }
      }
      
      // Show error toast with 5 second auto-dismiss
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      // Remove user from updating set
      setUpdatingRoles(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  return {
    updatingRoles,
    handleRoleChange
  };
};
