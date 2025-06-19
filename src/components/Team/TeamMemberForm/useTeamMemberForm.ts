
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "../TeamMembersList";
import { TeamMemberFormData } from "./formSchema";

interface UseTeamMemberFormProps {
  member?: TeamMember;
  onSuccess: () => void;
  form: UseFormReturn<TeamMemberFormData>;
}

export const useTeamMemberForm = ({ member, onSuccess, form }: UseTeamMemberFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: TeamMemberFormData) => {
    setIsSubmitting(true);
    
    try {
      // Clean up promotions data - remove empty promotions
      const cleanedPromotions = (data.promotions || []).filter(promotion => 
        promotion.title || promotion.description || promotion.photo_url
      );

      const submitData = {
        name: data.name,
        bio: data.bio,
        display_order: data.display_order,
        photo_url: data.photo_url || null,
        promotions: cleanedPromotions,
        // Clear legacy promotion fields since we're not using them anymore
        promotion_title: null,
        promotion_description: null,
        promotion_photo_url: null,
      };

      console.log('Submitting team member data:', submitData);

      if (member) {
        // Update existing member
        const { error } = await supabase
          .from('team_members')
          .update(submitData)
          .eq('id', member.id);
        
        if (error) throw error;

        toast({
          title: "Success",
          description: "Team member updated successfully.",
        });
      } else {
        // Create new member
        const { error } = await supabase
          .from('team_members')
          .insert(submitData);
        
        if (error) throw error;

        toast({
          title: "Success",
          description: "Team member created successfully.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast({
        title: "Error",
        description: "Failed to save team member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting,
  };
};
