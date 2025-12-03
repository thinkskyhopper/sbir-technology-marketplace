
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isValidUUID } from "@/utils/uuidValidation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileContent from "./ProfileContent";
import ProfileLoading from "./ProfileLoading";
import ProfileError from "./ProfileError";
import CreateListingDialog from "@/components/CreateListingDialog";

interface Profile {
  id: string;
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

const ProfilePage = () => {
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [displayProfile, setDisplayProfile] = useState<Profile | null>(null);
  const [isOtherUserProfile, setIsOtherUserProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const userId = searchParams.get('userId');

  useEffect(() => {
    console.log('👤 Profile page useEffect:', { 
      userId, 
      userIdFromAuth: user?.id, 
      authProfile: authProfile?.email || 'null',
      authLoading 
    });
    
    if (authLoading) {
      console.log('⏳ Still loading auth, waiting...');
      return;
    }
    
    // Validate UUID format if userId is present
    if (userId && !isValidUUID(userId)) {
      console.error('❌ Invalid UUID format:', userId);
      toast({
        title: "Invalid Profile ID",
        description: "The profile ID in the URL is not valid.",
        variant: "destructive",
      });
      // Redirect to own profile
      navigate('/profile', { replace: true });
      return;
    }
    
    if (userId && userId !== user?.id) {
      console.log('👥 Fetching other user profile for:', userId);
      fetchOtherUserProfile(userId);
    } else {
      console.log('👤 Setting own profile:', authProfile?.email || 'null');
      setDisplayProfile(authProfile);
      setIsOtherUserProfile(false);
      setLoading(false);
    }
  }, [userId, user?.id, authProfile, authLoading, navigate, toast]);

  const fetchOtherUserProfile = async (targetUserId: string) => {
    setLoading(true);
    try {
      console.log('🔍 Fetching public profile for user:', targetUserId);
      const { data, error } = await supabase.rpc('get_public_profile', {
        profile_user_id: targetUserId
      });

      if (error) {
        console.error('❌ Error fetching public profile:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('❌ No public profile found for user:', targetUserId);
        throw new Error('Profile not found or not accessible');
      }

      const publicProfile = data[0];
      const transformedProfile: Profile = {
        id: publicProfile.id,
        email: '', // Email is not included in public profile for privacy
        full_name: publicProfile.full_name,
        display_email: null, // Display email is not included in public profile
        company_name: publicProfile.company_name,
        bio: publicProfile.bio,
        photo_url: publicProfile.photo_url,
        role: publicProfile.role,
        notification_categories: [], // Not included in public profile
        created_at: publicProfile.created_at,
        updated_at: publicProfile.created_at // Use created_at as fallback since updated_at not in public function
      };

      console.log('✅ Public profile fetched for:', publicProfile.full_name || 'Unknown user');
      setDisplayProfile(transformedProfile);
      setIsOtherUserProfile(true);
    } catch (error) {
      console.error('💥 Error fetching public profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile. This profile may be private or not exist.",
        variant: "destructive",
      });
      setDisplayProfile(null);
      setIsOtherUserProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePostListingClick = () => {
    setShowCreateDialog(true);
  };

  if (authLoading || loading) {
    return <ProfileLoading onPostListingClick={handlePostListingClick} />;
  }

  if (!user) {
    return <ProfileError message="Please sign in to view profiles." onPostListingClick={handlePostListingClick} />;
  }

  console.log('🎨 Rendering profile page:', {
    displayProfile: displayProfile?.email || 'null',
    isOtherUserProfile,
    user: user?.email
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onPostListingClick={handlePostListingClick}
      />
      <div className="flex-1">
        <ProfileContent
          displayProfile={displayProfile}
          isOtherUserProfile={isOtherUserProfile}
          userId={userId}
          user={user}
          isEditDialogOpen={isEditDialogOpen}
          onEditDialogOpenChange={setIsEditDialogOpen}
        />
      </div>
      <Footer />
      
      <CreateListingDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default ProfilePage;
