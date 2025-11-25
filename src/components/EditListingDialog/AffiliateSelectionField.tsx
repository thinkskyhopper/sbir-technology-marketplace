import { UseFormReturn } from "react-hook-form";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAffiliateUsers } from "@/hooks/useAffiliateUsers";

interface AffiliateSelectionFieldProps {
  form: UseFormReturn<any>;
}

const AffiliateSelectionField = ({ form }: AffiliateSelectionFieldProps) => {
  const { data: affiliates = [], isLoading } = useAffiliateUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>Recommended Affiliates</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select up to two affiliate experts to recommend for this listing. They will be displayed to authenticated users on the listing detail page.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="recommended_affiliate_1_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Recommended Affiliate</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                  value={field.value || "none"}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an affiliate..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {affiliates.map((affiliate) => (
                      <SelectItem key={affiliate.id} value={affiliate.id}>
                        {affiliate.full_name || affiliate.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recommended_affiliate_2_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Second Recommended Affiliate</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                  value={field.value || "none"}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an affiliate..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {affiliates.map((affiliate) => (
                      <SelectItem key={affiliate.id} value={affiliate.id}>
                        {affiliate.full_name || affiliate.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AffiliateSelectionField;
