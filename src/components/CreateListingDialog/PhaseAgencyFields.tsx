
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
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListingFormData } from "./listingSchema";

interface PhaseAgencyFieldsProps {
  form: UseFormReturn<ListingFormData>;
}

const PhaseAgencyFields = ({ form }: PhaseAgencyFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="phase"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phase</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Phase I">Phase I</SelectItem>
                <SelectItem value="Phase II">Phase II</SelectItem>
                <SelectItem value="Phase III">Phase III</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="agency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agency</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Department of Defense" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PhaseAgencyFields;
