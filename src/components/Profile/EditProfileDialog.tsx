
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import ProfileFormFields from "./ProfileFormFields";
import { useProfileForm } from "./useProfileForm";

interface EditProfileDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  profile?: {
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
  } | null;
}

const EditProfileDialog = ({ open, onOpenChange, profile: propProfile }: EditProfileDialogProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { data: profile } = useQuery({
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
    enabled: !!user?.id && !propProfile
  });

  const displayProfile = propProfile || profile;
  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;

  const formHook = useProfileForm(displayProfile);

  const handleSubmit = async (data: any) => {
    await formHook.onSubmit(data);
    setDialogOpen(false);
  };

  if (!displayProfile) return null;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {open === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...formHook.form}>
          <form onSubmit={formHook.form.handleSubmit(handleSubmit)} className="space-y-6">
            <ProfileFormFields control={formHook.form.control} />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
