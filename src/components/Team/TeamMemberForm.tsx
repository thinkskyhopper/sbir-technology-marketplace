
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
  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: member?.name || "",
      bio: member?.bio || "",
      photo_url: member?.photo_url || "",
      display_order: member?.display_order || 0,
      promotions: member?.promotions || [],
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
