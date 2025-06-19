
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PhotoUpload from "@/components/PhotoUpload";

interface TeamMemberFormData {
  name: string;
  bio: string;
  photo_url?: string;
  promotion_title?: string;
  promotion_description?: string;
  promotion_photo_url?: string;
  display_order: number;
}

interface PromotionSectionProps {
  form: UseFormReturn<TeamMemberFormData>;
}

const PromotionSection = ({ form }: PromotionSectionProps) => {
  return (
    <div className="space-y-4 pt-6 border-t">
      <h3 className="text-lg font-semibold">Promotion Section (Optional)</h3>
      
      <div>
        <Label htmlFor="promotion_title">Promotion Title</Label>
        <Input
          id="promotion_title"
          {...form.register("promotion_title")}
          placeholder="e.g., Featured Book, Speaking Engagement, etc."
        />
      </div>

      <div>
        <Label htmlFor="promotion_description">Promotion Description</Label>
        <Textarea
          id="promotion_description"
          {...form.register("promotion_description")}
          placeholder="Describe the promotion"
          rows={3}
        />
      </div>

      <div>
        <Label>Promotion Photo</Label>
        <PhotoUpload
          currentPhotoUrl={form.watch("promotion_photo_url")}
          onPhotoChange={(url) => form.setValue("promotion_photo_url", url || "")}
        />
      </div>
    </div>
  );
};

export default PromotionSection;
