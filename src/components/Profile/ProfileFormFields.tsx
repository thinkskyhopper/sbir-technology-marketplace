
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { ProfileFormData } from "./profileFormSchema";
import NotificationCategoriesField from "./NotificationCategoriesField";

interface ProfileFormFieldsProps {
  control: Control<ProfileFormData>;
}

const ProfileFormFields = ({ control }: ProfileFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="display_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Email to display publicly" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              This email will be shown publicly instead of your signup email
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us about yourself..."
                className="min-h-[100px]"
                maxLength={500}
                {...field}
              />
            </FormControl>
            <FormDescription>
              {field.value?.length || 0}/500 characters
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <NotificationCategoriesField control={control} />
    </div>
  );
};

export default ProfileFormFields;
