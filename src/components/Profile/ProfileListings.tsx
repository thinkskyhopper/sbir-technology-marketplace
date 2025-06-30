
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import type { SBIRListing } from "@/types/listings";
import ProfileListingsHeader from "./ProfileListings/ProfileListingsHeader";
import ProfileListingCard from "./ProfileListings/ProfileListingCard";
import ProfileListingsEmpty from "./ProfileListings/ProfileListingsEmpty";
import ProfileListingsLoading from "./ProfileListings/ProfileListingsLoading";
import EditListingDialog from "../EditListingDialog";
import RequestChangeDialog from "../RequestChangeDialog";

interface ProfileListingsProps {
  userId?: string | null;
  isOwnProfile: boolean;
}

const ProfileListings = ({ userId, isOwnProfile }: ProfileListingsProps) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const targetUserId = userId || user?.id;

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [requestChangeDialogOpen, setRequestChangeDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SBIRListing | null>(null);

  console.log('📋 ProfileListings props:', {
    userId,
    isOwnProfile,
    targetUserId,
    userEmail: user?.email,
    isAdmin
  });

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['profile-listings', targetUserId],
    queryFn: async () => {
      if (!targetUserId) {
        console.log('❌ No target user ID, returning empty array');
        return [];
      }
      
      console.log('🔍 Fetching listings for user:', targetUserId, {
        isOwnProfile, 
        isAdmin,
        userEmail: user?.email
      });
      
      try {
        let query = supabase
          .from('sbir_listings')
          .select('*')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false });

        // Show all statuses for own profile or admin, only active for others
        if (!isOwnProfile && !isAdmin) {
          console.log('🔒 Filtering to Active listings only (not own profile or admin)');
          query = query.eq('status', 'Active');
        } else {
          console.log('👁️ Showing all listings (own profile or admin)');
        }

        const { data, error } = await query;

        if (error) {
          console.error('❌ Error fetching profile listings:', error);
          throw error;
        }

        console.log('✅ Profile listings fetched successfully:', {
          count: data?.length || 0,
          listings: data?.map(l => ({ id: l.id, title: l.title, status: l.status })) || []
        });
        
        return data || [];
      } catch (error) {
        console.error('💥 Query failed:', error);
        throw error;
      }
    },
    enabled: !!targetUserId,
    retry: 1,
    staleTime: 30000 // 30 seconds
  });

  const handleEditListing = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setEditDialogOpen(true);
  };

  const handleRequestChange = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setRequestChangeDialogOpen(true);
  };

  if (isLoading) {
    console.log('⏳ ProfileListings showing loading state');
    return <ProfileListingsLoading />;
  }

  if (error) {
    console.error('💥 ProfileListings error:', error);
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading listings: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('🎨 Rendering ProfileListings:', {
    listingsCount: listings?.length || 0,
    isOwnProfile,
    targetUserId
  });

  return (
    <>
      <Card>
        <ProfileListingsHeader
          listingCount={listings?.length || 0}
          isViewingOwnProfile={isOwnProfile}
          createDialogOpen={createDialogOpen}
          onCreateDialogOpenChange={setCreateDialogOpen}
        />
        <CardContent>
          {!listings || listings.length === 0 ? (
            <ProfileListingsEmpty isViewingOwnProfile={isOwnProfile} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ProfileListingCard
                  key={listing.id}
                  listing={listing}
                  isViewingOwnProfile={isOwnProfile}
                  onEditListing={handleEditListing}
                  onRequestChange={handleRequestChange}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditListingDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        listing={selectedListing}
      />
      
      <RequestChangeDialog
        open={requestChangeDialogOpen}
        onOpenChange={setRequestChangeDialogOpen}
        listing={selectedListing}
        requestType="change"
      />
    </>
  );
};

export default ProfileListings;
