
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeamMember } from "./TeamMembersList";
import { teamMemberSchema, TeamMemberFormData } from "./TeamMemberForm/formSchema";
import { useTeamMemberForm } from "./TeamMemberForm/useTeamMemberForm";
import BasicInfoFields from "./TeamMemberForm/BasicInfoFields";
import PhotoUploadSection from "./TeamMemberForm/PhotoUploadSection";
import PromotionSection from "./TeamMemberForm/PromotionSection";
import FormActions from "./TeamMemberForm/FormActions";

interface TeamMemberFormProps {
  member?: TeamMember;
  onSuccess: () => void;
}

const TeamMemberForm = ({ member, onSuccess }: TeamMemberFormProps) => {
  // Initialize promotions array from legacy fields if they exist
  const initializePromotions = () => {
    if (!member) return [];
    
    // If there are legacy promotion fields, convert them to the new format
    if (member.promotion_title || member.promotion_description || member.promotion_photo_url) {
      return [{
        title: member.promotion_title || "",
        description: member.promotion_description || "",
        photo_url: member.promotion_photo_url || "",
      }];
    }
    
    return [];
  };

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: member?.name || "",
      bio: member?.bio || "",
      photo_url: member?.photo_url || "",
      promotion_title: member?.promotion_title || "",
      promotion_description: member?.promotion_description || "",
      promotion_photo_url: member?.promotion_photo_url || "",
      display_order: member?.display_order || 0,
      promotions: initializePromotions(),
    },
  });

  const { onSubmit, isSubmitting } = useTeamMemberForm({
    member,
    onSuccess,
    form,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <BasicInfoFields form={form} />
      <PhotoUploadSection form={form} />
      <PromotionSection form={form} />
      <FormActions isSubmitting={isSubmitting} member={member} />
    </form>
  );
};

export default TeamMemberForm;
