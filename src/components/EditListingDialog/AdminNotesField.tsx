
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UseFormReturn } from "react-hook-form";

interface AdminNotesFieldProps {
  form: UseFormReturn<any>;
}

const AdminNotesField = ({ form }: AdminNotesFieldProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Admin Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="admin_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internal Notes (for audit trail)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add internal notes about this edit for the audit log..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default AdminNotesField;
