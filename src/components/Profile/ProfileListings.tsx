
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Pending': return 'secondary';
      case 'Hidden': return 'outline';
      default: return 'secondary';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Phase I': return 'bg-blue-100 text-blue-800';
      case 'Phase II': return 'bg-green-100 text-green-800';
      case 'Phase III': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your SBIR Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
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
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">
                    {listing.title}
                  </CardTitle>
                  <Badge variant={getStatusColor(listing.status)}>
                    {listing.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{listing.agency}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {listing.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPhaseColor(listing.phase)}`}>
                      {listing.phase}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {listing.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 text-green-600" />
                      <span className="font-medium">
                        ${listing.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs">
                        {new Date(listing.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => navigate(`/listing/${listing.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileListings;
