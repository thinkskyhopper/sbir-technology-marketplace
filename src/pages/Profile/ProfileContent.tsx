
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileListings from "@/components/Profile/ProfileListings";
import EditProfileDialog from "@/components/Profile/EditProfileDialog";

interface Profile {
  id: string;
  public_id?: string;
  email: string;
  full_name: string | null;
  display_email: string | null;
  company_name: string | null;
  bio: string | null;
  photo_url?: string | null;
  role: string;
  notification_categories: string[] | null;
  created_at: string;
  updated_at: string;
}

interface ProfileContentProps {
  displayProfile: Profile | null;
  isOtherUserProfile: boolean;
  userId: string | null;
  user: any;
  isEditDialogOpen: boolean;
  onEditDialogOpenChange: (open: boolean) => void;
}

const ProfileContent = ({
  displayProfile,
  isOtherUserProfile,
  userId,
  user,
  isEditDialogOpen,
  onEditDialogOpenChange
}: ProfileContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <ProfileHeader 
        profile={displayProfile}
        isOwnProfile={!isOtherUserProfile}
        onEdit={() => onEditDialogOpenChange(true)}
        userId={isOtherUserProfile ? userId : undefined}
      />
      
      <ProfileListings 
        userId={isOtherUserProfile ? userId : user?.id}
        isOwnProfile={!isOtherUserProfile}
      />

      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={onEditDialogOpenChange}
        profile={displayProfile}
      />
    </div>
  );
};

export default ProfileContent;
