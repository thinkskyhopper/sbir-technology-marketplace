
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
      render={({ field }) => (
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
            <span className="text-sm text-muted-foreground">
              {field.value?.length || 0}/2000 characters
            </span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionField;
