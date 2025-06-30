
import { Building, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SBIRListing } from "@/types/listings";

interface ProfileListingCardProps {
  listing: SBIRListing;
  isViewingOwnProfile: boolean;
  onViewListing: (listingId: string) => void;
  onEditListing: (listing: SBIRListing) => void;
  onRequestChange: (listing: SBIRListing) => void;
}

const ProfileListingCard = ({
  listing,
  isViewingOwnProfile,
  onViewListing,
  onEditListing,
  onRequestChange
}: ProfileListingCardProps) => {
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

  return (
    <Card className="border-l-4 border-l-primary/20">
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
              onClick={() => onViewListing(listing.id)}
            >
              View
            </Button>
            {isViewingOwnProfile && (
              <>
                {listing.status === 'Active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRequestChange(listing)}
                  >
                    Request Changes
                  </Button>
                )}
                {(listing.status === 'Pending' || listing.status === 'Rejected') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditListing(listing)}
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
  );
};

export default ProfileListingCard;
