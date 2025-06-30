
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";
import { CATEGORIES } from "@/utils/categoryConstants";
import { ProfileFormData } from "./profileFormSchema";

interface NotificationCategoriesFieldProps {
  control: Control<ProfileFormData>;
}

const NotificationCategoriesField = ({ control }: NotificationCategoriesFieldProps) => {
  return (
    <FormField
      control={control}
      name="notification_categories"
      render={() => (
        <FormItem>
          <FormLabel>Email Notifications</FormLabel>
          <FormDescription>
            Select categories to receive email notifications for new SBIR listings
          </FormDescription>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {CATEGORIES.map((category) => (
              <FormField
                key={category}
                control={control}
                name="notification_categories"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={category}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(category)}
                          onCheckedChange={(checked) => {
                            const updatedCategories = checked
                              ? [...(field.value || []), category]
                              : (field.value || []).filter(
                                  (value) => value !== category
                                );
                            field.onChange(updatedCategories);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {category}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotificationCategoriesField;
