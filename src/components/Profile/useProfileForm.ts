
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileSchema, ProfileFormData } from "./profileFormSchema";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  display_email: string | null;
  company_name: string | null;
  bio: string | null;
  role: string;
  notification_categories: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export const useProfileForm = (profile?: Profile | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fetchedProfile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      // Transform the data to match our Profile interface
      return {
        ...data,
        notification_categories: Array.isArray(data.notification_categories) 
          ? data.notification_categories as string[]
          : []
      };
    },
    enabled: !!user?.id && !profile
  });

  const displayProfile = profile || fetchedProfile;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      display_email: "",
      bio: ""
    }
  });

  // Update form when profile data loads
  useEffect(() => {
    if (displayProfile) {
      // Split full_name into first and last name
      const nameParts = (displayProfile.full_name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      form.reset({
        first_name: firstName,
        last_name: lastName,
        display_email: displayProfile.display_email || "",
        bio: displayProfile.bio || ""
      });
    }
  }, [displayProfile, form]);

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
          bio: data.bio || null
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });

      // Refresh the profile data
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
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
    profile: displayProfile,
    isLoading,
    onSubmit
  };
};
