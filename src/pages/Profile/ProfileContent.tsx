
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark } from "lucide-react";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileListings from "@/components/Profile/ProfileListings";
import EditProfileDialog from "@/components/Profile/EditProfileDialog";
import NotificationPreferences from "@/components/Profile/NotificationPreferences";
import MarketplaceCard from "@/components/MarketplaceCard";
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

interface ProfileContentProps {
  displayProfile: Profile | null;
  isOtherUserProfile: boolean;
  userId: string | null;
  user: any;
  bookmarkedListings: SBIRListing[];
  bookmarksLoading: boolean;
  isEditDialogOpen: boolean;
  onEditDialogOpenChange: (open: boolean) => void;
}

const ProfileContent = ({
  displayProfile,
  isOtherUserProfile,
  userId,
  user,
  bookmarkedListings,
  bookmarksLoading,
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
      
      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="listings">Listings</TabsTrigger>
          {!isOtherUserProfile && (
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          )}
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
          <TabsContent value="bookmarked">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  Bookmarked Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookmarksLoading ? (
                  <div className="text-center py-8">
                    <p>Loading bookmarked listings...</p>
                  </div>
                ) : bookmarkedListings.length === 0 ? (
                  <div className="text-center py-8">
                    <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bookmarked listings</h3>
                    <p className="text-muted-foreground">
                      Browse the marketplace and bookmark listings you're interested in.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedListings.map((listing) => (
                      <MarketplaceCard
                        key={listing.id}
                        listing={listing}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {!isOtherUserProfile && (
          <TabsContent value="notifications">
            <NotificationPreferences />
          </TabsContent>
        )}
      </Tabs>

      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={onEditDialogOpenChange}
        profile={displayProfile}
      />
    </div>
  );
};

export default ProfileContent;
