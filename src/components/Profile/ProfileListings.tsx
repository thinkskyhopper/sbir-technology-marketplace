
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Calendar, DollarSign, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CreateListingDialog from "../CreateListingDialog";
import EditListingDialog from "../EditListingDialog";
import RequestChangeDialog from "../RequestChangeDialog";
import type { SBIRListing } from "@/types/listings";

interface ProfileListingsProps {
  userId?: string | null;
}

const ProfileListings = ({ userId }: ProfileListingsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isViewingOwnProfile = !userId || userId === user?.id;
  const targetUserId = userId || user?.id;

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [requestChangeDialogOpen, setRequestChangeDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SBIRListing | null>(null);

  const { data: listings, isLoading } = useQuery({
    queryKey: ['profile-listings', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from('sbir_listings')
        .select('*')
        .eq('user_id', targetUserId)
        .in('status', ['Active', 'Sold'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId
  });

  const handleViewListing = (listingId: string) => {
    navigate(`/listing/${listingId}`);
  };

  const handleEditListing = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setEditDialogOpen(true);
  };

  const handleRequestChange = (listing: SBIRListing) => {
    setSelectedListing(listing);
    setRequestChangeDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500 hover:bg-green-600';
      case 'Pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Rejected':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>SBIR Listings</span>
              <Badge variant="secondary">{listings?.length || 0}</Badge>
            </CardTitle>
            {isViewingOwnProfile && (
              <CreateListingDialog 
                open={createDialogOpen} 
                onOpenChange={setCreateDialogOpen} 
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {listings?.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {isViewingOwnProfile ? "You don't have any active or sold SBIR listings." : "This user doesn't have any active or sold SBIR listings."}
            </div>
          ) : (
            <div className="space-y-4">
              {listings?.map((listing) => (
                <Card key={listing.id} className="border-l-4 border-l-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{listing.title}</h3>
                          <Badge 
                            className={`text-white ${getStatusColor(listing.status)}`}
                          >
                            {listing.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {listing.description}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span>{listing.agency}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span>${listing.value?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Due: {new Date(listing.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewListing(listing.id)}
                        >
                          View
                        </Button>
                        {isViewingOwnProfile && (
                          <>
                            {listing.status === 'Active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRequestChange(listing)}
                              >
                                Request Changes
                              </Button>
                            )}
                            {(listing.status === 'Pending' || listing.status === 'Rejected') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditListing(listing)}
                              >
                                Edit
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
