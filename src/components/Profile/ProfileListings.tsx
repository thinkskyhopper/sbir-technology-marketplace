
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

  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['profile-listings', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      console.log('Fetching listings for user:', targetUserId, 'isOwnProfile:', isOwnProfile, 'isAdmin:', isAdmin);
      
      let query = supabase
        .from('sbir_listings')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      // If viewing own profile or admin, show more statuses
      if (isOwnProfile || isAdmin) {
        query = query.in('status', ['Active', 'Pending', 'Sold']);
      } else {
        // For other users' profiles, only show active listings
        query = query.eq('status', 'Active');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching profile listings:', error);
        throw error;
      }

      console.log('Profile listings fetched:', data?.length || 0);
      return data || [];
    },
    enabled: !!targetUserId
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
    return <ProfileListingsLoading />;
  }

  if (error) {
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
