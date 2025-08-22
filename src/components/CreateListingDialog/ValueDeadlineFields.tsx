
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ListingFormData } from "./listingSchema";

interface ValueDeadlineFieldsProps {
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

const ValueDeadlineFields = ({ form }: ValueDeadlineFieldsProps) => {
  return (
    <FormField
      control={form.control}
      name="value"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sale Price (USD)</FormLabel>
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
  );
};

export default ValueDeadlineFields;
