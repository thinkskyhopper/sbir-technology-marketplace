
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";

interface TechnologySummaryFieldProps {
  form: UseFormReturn<any>;
}

const TechnologySummaryField = ({ form }: TechnologySummaryFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="technology_summary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Technology Summary (Optional)</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="e.g., AI-Powered Defense Analytics"
              maxLength={50}
            />
          </FormControl>
          <FormDescription>
            3-5 word summary of your technology (will be displayed if listing is sold)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TechnologySummaryField;
