
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
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ListingFormData } from "./listingSchema";

interface ListingFormFieldsProps {
  form: UseFormReturn<ListingFormData>;
}

const formatUSDValue = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '');
  
  // Handle empty or invalid input
  if (!numericValue || numericValue === '.') {
    return '';
  }
  
  // Parse as number
  const number = parseFloat(numericValue);
  
  // If invalid number, return original input
  if (isNaN(number)) {
    return numericValue;
  }
  
  // Format with commas and proper decimal places
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
};

const parseUSDValue = (formattedValue: string): number => {
  // Remove all non-numeric characters except decimal point
  const numericValue = formattedValue.replace(/[^0-9.]/g, '');
  const number = parseFloat(numericValue);
  return isNaN(number) ? 0 : number;
};

const ListingFormFields = ({ form }: ListingFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter listing title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
            <FormMessage />
          </FormItem>
        )}
      />

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value (USD)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="0"
                  value={field.value ? formatUSDValue(field.value.toString()) : ''}
                  onChange={(e) => {
                    // Allow any input during typing
                    const rawValue = e.target.value;
                    const numericValue = parseUSDValue(rawValue);
                    field.onChange(numericValue);
                  }}
                  onBlur={(e) => {
                    // Format the value when user clicks out of the field
                    const rawValue = e.target.value;
                    const numericValue = parseUSDValue(rawValue);
                    field.onChange(numericValue);
                    // Force re-render to show formatted value
                    e.target.value = formatUSDValue(numericValue.toString());
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Cybersecurity, AI/ML, Aerospace" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ListingFormFields;
