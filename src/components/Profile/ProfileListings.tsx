
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MarketplaceCard from "@/components/MarketplaceCard";
import type { SBIRListing } from "@/types/listings";

const ProfileListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['profile-listings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('sbir_listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(listing => ({
        ...listing,
        value: listing.value / 100, // Convert cents to dollars
        deadline: new Date(listing.deadline).toISOString().split('T')[0],
        profiles: null
      })) as SBIRListing[];
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your SBIR Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your SBIR Listings</h2>
        <p className="text-muted-foreground">
          {listings?.length || 0} listing{listings?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {!listings || listings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't posted any SBIR listings yet. Start by creating your first listing.
            </p>
            <Button onClick={() => navigate('/')}>
              Create Your First Listing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <MarketplaceCard
              key={listing.id}
              listing={listing}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileListings;
