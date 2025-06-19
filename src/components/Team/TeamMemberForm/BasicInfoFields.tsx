
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TeamMemberFormData } from "./formSchema";

interface BasicInfoFieldsProps {
  form: UseFormReturn<TeamMemberFormData>;
}

const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
  return (
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
  );
};

export default BasicInfoFields;
