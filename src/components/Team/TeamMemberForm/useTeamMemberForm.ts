
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
      // Handle promotion data - prioritize new promotions array over legacy fields
      let promotionData = {
        promotion_title: null as string | null,
        promotion_description: null as string | null,
        promotion_photo_url: null as string | null,
      };

      // If we have new promotions, use the first one for legacy compatibility
      if (data.promotions && data.promotions.length > 0) {
        const firstPromotion = data.promotions[0];
        promotionData = {
          promotion_title: firstPromotion.title || null,
          promotion_description: firstPromotion.description || null,
          promotion_photo_url: firstPromotion.photo_url || null,
        };
      } else if (data.promotion_title || data.promotion_description || data.promotion_photo_url) {
        // Fall back to legacy fields if no new promotions
        promotionData = {
          promotion_title: data.promotion_title || null,
          promotion_description: data.promotion_description || null,
          promotion_photo_url: data.promotion_photo_url || null,
        };
      }

      const submitData = {
        name: data.name,
        bio: data.bio,
        display_order: data.display_order,
        photo_url: data.photo_url || null,
        ...promotionData,
      };

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
