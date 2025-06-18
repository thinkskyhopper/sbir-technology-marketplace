
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListingFormData } from "./listingSchema";

interface DescriptionFieldProps {
  form: UseFormReturn<ListingFormData>;
}

const DescriptionField = ({ form }: DescriptionFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => {
        const characterCount = field.value?.length || 0;
        const isOverLimit = characterCount > 5000;
        
        return (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter detailed description"
                rows={4}
                {...field}
              />
            </FormControl>
            <div className="flex justify-end">
              <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
                {characterCount}/5000 characters
              </span>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DescriptionField;
