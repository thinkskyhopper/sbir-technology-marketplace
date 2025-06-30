
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileListings from "@/components/Profile/ProfileListings";
import EditProfileDialog from "@/components/Profile/EditProfileDialog";
import NotificationPreferences from "@/components/Profile/NotificationPreferences";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  display_email: string | null;
  company_name: string | null;
  bio: string | null;
  role: string;
  notification_categories: string[] | null;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [displayProfile, setDisplayProfile] = useState<Profile | null>(null);
  const [isOtherUserProfile, setIsOtherUserProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if viewing another user's profile
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
    
    if (userId && userId !== user?.id) {
      // Viewing another user's profile
      console.log('👥 Fetching other user profile for:', userId);
      fetchOtherUserProfile(userId);
    } else {
      // Viewing own profile
      console.log('👤 Setting own profile:', authProfile?.email || 'null');
      setDisplayProfile(authProfile);
      setIsOtherUserProfile(false);
      setLoading(false);
    }
  }, [userId, user?.id, authProfile, authLoading]);

  const fetchOtherUserProfile = async (targetUserId: string) => {
    setLoading(true);
    try {
      console.log('🔍 Fetching profile for user:', targetUserId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        throw error;
      }

      // Transform the data to match our Profile interface
      const transformedProfile: Profile = {
        ...data,
        notification_categories: Array.isArray(data.notification_categories) 
          ? data.notification_categories as string[]
          : []
      };

      console.log('✅ Other user profile fetched:', transformedProfile.email);
      setDisplayProfile(transformedProfile);
      setIsOtherUserProfile(true);
    } catch (error) {
      console.error('💥 Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
      setDisplayProfile(null);
      setIsOtherUserProfile(false);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while auth is loading or we're fetching profile
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p>Loading profile...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p>Please sign in to view profiles.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  console.log('🎨 Rendering profile page:', {
    displayProfile: displayProfile?.email || 'null',
    isOtherUserProfile,
    user: user?.email
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8 space-y-6">
        <ProfileHeader 
          profile={displayProfile}
          isOwnProfile={!isOtherUserProfile}
          onEdit={() => setIsEditDialogOpen(true)}
          userId={isOtherUserProfile ? userId : undefined}
        />
        
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            {!isOtherUserProfile && (
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="listings">
            <ProfileListings 
              userId={isOtherUserProfile ? userId : user?.id}
              isOwnProfile={!isOtherUserProfile}
            />
          </TabsContent>
          
          {!isOtherUserProfile && (
            <TabsContent value="notifications">
              <NotificationPreferences />
            </TabsContent>
          )}
        </Tabs>

        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          profile={displayProfile}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
