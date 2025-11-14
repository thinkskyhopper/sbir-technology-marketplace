
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ListingFormData } from "./listingSchema";

interface ListingTypeFieldProps {
  form: UseFormReturn<ListingFormData>;
}

const ListingTypeField = ({ form }: ListingTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="listing_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Listing Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select listing type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="IP">IP</SelectItem>
              <SelectItem value="Contract & IP">Contract & IP</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ListingTypeField;
