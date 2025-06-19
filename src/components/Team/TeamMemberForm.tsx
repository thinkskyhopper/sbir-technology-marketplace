
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "./TeamMembersList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PhotoUpload from "@/components/PhotoUpload";

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  photo_url: z.string().optional(),
  promotion_title: z.string().optional(),
  promotion_description: z.string().optional(),
  promotion_photo_url: z.string().optional(),
  display_order: z.number().min(0, "Display order must be 0 or greater"),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

interface TeamMemberFormProps {
  member?: TeamMember;
  onSuccess: () => void;
}

const TeamMemberForm = ({ member, onSuccess }: TeamMemberFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    },
  });

  const onSubmit = async (data: TeamMemberFormData) => {
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...data,
        photo_url: data.photo_url || null,
        promotion_title: data.promotion_title || null,
        promotion_description: data.promotion_description || null,
        promotion_photo_url: data.promotion_photo_url || null,
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
          .insert([submitData]);
        
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Enter team member name"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="bio">Bio *</Label>
          <Textarea
            id="bio"
            {...form.register("bio")}
            placeholder="Enter team member bio"
            rows={6}
          />
          {form.formState.errors.bio && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.bio.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            {...form.register("display_order", { valueAsNumber: true })}
            placeholder="0"
          />
          {form.formState.errors.display_order && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.display_order.message}
            </p>
          )}
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <Label>Profile Photo</Label>
        <PhotoUpload
          currentPhotoUrl={form.watch("photo_url")}
          onPhotoUploaded={(url) => form.setValue("photo_url", url)}
          onPhotoRemoved={() => form.setValue("photo_url", "")}
        />
      </div>

      {/* Promotion Section */}
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
            onPhotoUploaded={(url) => form.setValue("promotion_photo_url", url)}
            onPhotoRemoved={() => form.setValue("promotion_photo_url", "")}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-6 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : member ? "Update Member" : "Add Member"}
        </Button>
      </div>
    </form>
  );
};

export default TeamMemberForm;
