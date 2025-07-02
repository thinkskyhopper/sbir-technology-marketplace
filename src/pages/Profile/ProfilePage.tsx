
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useBookmarks } from "@/hooks/useBookmarks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookmarkedListings from "@/components/BookmarkedListings";
import ProfileContent from "./ProfileContent";
import ProfileLoading from "./ProfileLoading";
import ProfileError from "./ProfileError";
import type { SBIRListing } from "@/types/listings";

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

const ProfilePage = () => {
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [displayProfile, setDisplayProfile] = useState<Profile | null>(null);
  const [isOtherUserProfile, setIsOtherUserProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookmarkedListings, setBookmarkedListings] = useState<SBIRListing[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [showBookmarkedListings, setShowBookmarkedListings] = useState(false);
  
  const { fetchBookmarkedListings } = useBookmarks();
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
      console.log('👥 Fetching other user profile for:', userId);
      fetchOtherUserProfile(userId);
    } else {
      console.log('👤 Setting own profile:', authProfile?.email || 'null');
      setDisplayProfile(authProfile);
      setIsOtherUserProfile(false);
      setLoading(false);
    }
  }, [userId, user?.id, authProfile, authLoading]);

  useEffect(() => {
    if (!isOtherUserProfile && user) {
      loadBookmarkedListings();
    }
  }, [isOtherUserProfile, user]);

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

  const loadBookmarkedListings = async () => {
    setBookmarksLoading(true);
    try {
      const listings = await fetchBookmarkedListings();
      setBookmarkedListings(listings);
    } catch (error) {
      console.error('Error loading bookmarked listings:', error);
    } finally {
      setBookmarksLoading(false);
    }
  };

  const handleShowBookmarkedListings = () => {
    setShowBookmarkedListings(true);
  };

  const handleBackFromBookmarks = () => {
    setShowBookmarkedListings(false);
  };

  const handlePostListingClick = () => {
    // Navigate to home - this will be handled by the header
  };

  if (authLoading || loading) {
    return <ProfileLoading onShowBookmarkedListings={handleShowBookmarkedListings} onPostListingClick={handlePostListingClick} />;
  }

  if (!user) {
    return <ProfileError message="Please sign in to view profiles." onShowBookmarkedListings={handleShowBookmarkedListings} onPostListingClick={handlePostListingClick} />;
  }

  console.log('🎨 Rendering profile page:', {
    displayProfile: displayProfile?.email || 'null',
    isOtherUserProfile,
    user: user?.email
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onShowBookmarkedListings={handleShowBookmarkedListings}
        onPostListingClick={handlePostListingClick}
      />
      <div className="flex-1">
        {showBookmarkedListings ? (
          <BookmarkedListings onBack={handleBackFromBookmarks} />
        ) : (
          <ProfileContent
            displayProfile={displayProfile}
            isOtherUserProfile={isOtherUserProfile}
            userId={userId}
            user={user}
            bookmarkedListings={bookmarkedListings}
            bookmarksLoading={bookmarksLoading}
            isEditDialogOpen={isEditDialogOpen}
            onEditDialogOpenChange={setIsEditDialogOpen}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
