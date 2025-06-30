
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileSchema, ProfileFormData } from "./profileFormSchema";

export const useProfileForm = (isOpen: boolean, onClose: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && isOpen
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      display_email: "",
      bio: "",
      notification_categories: []
    }
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      // Split full_name into first and last name
      const nameParts = (profile.full_name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      form.reset({
        first_name: firstName,
        last_name: lastName,
        display_email: profile.display_email || "",
        bio: profile.bio || "",
        notification_categories: Array.isArray(profile.notification_categories) 
          ? profile.notification_categories as string[]
          : []
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;

    try {
      // Combine first and last name into full_name for storage
      const fullName = `${data.first_name} ${data.last_name}`.trim();

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          display_email: data.display_email || null,
          bio: data.bio || null,
          notification_categories: data.notification_categories || []
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });

      // Refresh the profile data
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    form,
    profile,
    isLoading,
    onSubmit
  };
};
