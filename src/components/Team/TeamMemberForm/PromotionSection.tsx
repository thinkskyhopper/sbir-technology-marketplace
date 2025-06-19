
import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import PhotoUpload from "@/components/PhotoUpload";
import { TeamMemberFormData } from "./formSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PromotionSectionProps {
  form: UseFormReturn<TeamMemberFormData>;
}

const PromotionSection = ({ form }: PromotionSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "promotions",
  });

  // Check if there's any legacy promotion data
  const hasLegacyPromotion = form.watch("promotion_title") || 
                            form.watch("promotion_description") || 
                            form.watch("promotion_photo_url");

  const addPromotion = () => {
    if (fields.length < 4) {
      append({ title: "", description: "", photo_url: "" });
    }
  };

  const clearLegacyPromotion = () => {
    form.setValue("promotion_title", "");
    form.setValue("promotion_description", "");
    form.setValue("promotion_photo_url", "");
  };

  return (
    <div className="space-y-4 pt-6 border-t">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Promotion Cards (Optional)</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPromotion}
          disabled={fields.length >= 4}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Promotion
        </Button>
      </div>
      
      {/* Legacy promotion fields - only show if no new promotions and has legacy data */}
      {hasLegacyPromotion && fields.length === 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-orange-800">Legacy Promotion</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearLegacyPromotion}
                className="text-orange-600 hover:text-orange-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-orange-700">This is a legacy promotion. Clear it to use the new promotion system.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="promotion_title">Promotion Title</Label>
              <Input
                id="promotion_title"
                {...form.register("promotion_title")}
                placeholder="e.g., Featured Book, Speaking Engagement, etc."
                className="border-orange-200"
              />
            </div>

            <div>
              <Label htmlFor="promotion_description">Promotion Description</Label>
              <Textarea
                id="promotion_description"
                {...form.register("promotion_description")}
                placeholder="Describe the promotion"
                rows={3}
                className="border-orange-200"
              />
            </div>

            <div>
              <Label>Promotion Photo</Label>
              <PhotoUpload
                currentPhotoUrl={form.watch("promotion_photo_url")}
                onPhotoChange={(url) => form.setValue("promotion_photo_url", url || "")}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* New promotion cards */}
      {fields.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Promotion {index + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`promotions.${index}.title`}>Title</Label>
                  <Input
                    {...form.register(`promotions.${index}.title`)}
                    placeholder="Promotion title"
                  />
                </div>

                <div>
                  <Label htmlFor={`promotions.${index}.description`}>Description</Label>
                  <Textarea
                    {...form.register(`promotions.${index}.description`)}
                    placeholder="Promotion description"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Photo</Label>
                  <PhotoUpload
                    currentPhotoUrl={form.watch(`promotions.${index}.photo_url`)}
                    onPhotoChange={(url) => form.setValue(`promotions.${index}.photo_url`, url || "")}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {fields.length === 0 && !hasLegacyPromotion && (
        <div className="text-center text-muted-foreground py-8">
          <p>No promotion cards added yet. Click "Add Promotion" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default PromotionSection;
