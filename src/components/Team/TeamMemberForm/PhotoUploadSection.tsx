
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import PhotoUpload from "@/components/PhotoUpload";
import { TeamMemberFormData } from "./formSchema";

interface PhotoUploadSectionProps {
  form: UseFormReturn<TeamMemberFormData>;
}

const PhotoUploadSection = ({ form }: PhotoUploadSectionProps) => {
  return (
    <div>
      <Label>Profile Photo</Label>
      <PhotoUpload
        currentPhotoUrl={form.watch("photo_url")}
        onPhotoChange={(url) => form.setValue("photo_url", url || "")}
      />
    </div>
  );
};

export default PhotoUploadSection;
