
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import type { SBIRListing } from "@/types/listings";

interface ListingDetailRelatedListingsProps {
  currentListing: SBIRListing;
  allListings: SBIRListing[];
  isCurrentUserAdmin: boolean;
}

const ListingDetailRelatedListings = ({ 
  currentListing, 
  allListings, 
  isCurrentUserAdmin 
}: ListingDetailRelatedListingsProps) => {
  const getRelatedListings = () => {
    // Filter out the current listing
    const otherListings = allListings.filter(
      listing => listing.id !== currentListing.id && listing.status === 'Active'
    );

    // If current listing was created by a non-admin user, show other listings by the same user
    if (!isCurrentUserAdmin) {
      const userListings = otherListings.filter(
        listing => listing.user_id === currentListing.user_id
      );
      
      // If user has other active listings, return them (limited to 3)
      if (userListings.length > 0) {
        return userListings.slice(0, 3);
      }
    }

    // Fallback: show other listings in the same category (limited to 3)
    return otherListings
      .filter(listing => listing.category === currentListing.category)
      .slice(0, 3);
  };

  const relatedListings = getRelatedListings();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (relatedListings.length === 0) {
    return null;
  }

  const isUserListings = !isCurrentUserAdmin && 
    relatedListings.some(listing => listing.user_id === currentListing.user_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {isUserListings ? "More from this Seller" : "Related Listings"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedListings.map((listing) => (
          <Link 
            key={listing.id}
            to={`/listing/${listing.id}`}
            className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-2">
              <h4 className="font-medium text-sm line-clamp-2 hover:text-primary">
                {listing.title}
              </h4>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" />
                  <span className="font-medium">{formatCurrency(listing.value)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{formatDate(listing.deadline)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {listing.phase}
                </Badge>
                <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {listing.agency}
                </span>
              </div>
            </div>
          </Link>
        ))}
        
        {relatedListings.length === 3 && (
          <div className="pt-2 border-t">
            <Link 
              to="/?view=marketplace"
              className="text-sm text-primary hover:underline"
            >
              View more listings →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListingDetailRelatedListings;
