
import { Building, Calendar, DollarSign, FileText, Edit } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { SBIRListing } from "@/types/listings";
import { useAuth } from "@/contexts/AuthContext";
import { getDefaultCategoryImage } from "@/utils/categoryDefaultImages";

interface ProfileListingCardProps {
  listing: SBIRListing;
  isViewingOwnProfile: boolean;
  onEditListing: (listing: SBIRListing) => void;
  onRequestChange: (listing: SBIRListing) => void;
}

const ProfileListingCard = ({
  listing,
  isViewingOwnProfile,
  onEditListing,
  onRequestChange
}: ProfileListingCardProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin } = useAuth();

  // Check if listing has a custom image
  const hasCustomImage = listing.photo_url && listing.photo_url.trim() !== '';
  const imageUrl = hasCustomImage ? listing.photo_url : getDefaultCategoryImage(listing.category);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = () => {
    const currentParams = new URLSearchParams(searchParams);
    const listingUrl = `/listing/${listing.id}`;
    
    if (currentParams.toString()) {
      navigate(`${listingUrl}?${currentParams.toString()}`);
    } else {
      navigate(listingUrl);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-600';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Rejected':
        return 'bg-red-500';
      case 'Sold':
        return 'bg-blue-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="card-hover bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="default" className="text-xs">
            {listing.phase}
          </Badge>
          <div className="flex gap-1">
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onEditListing(listing)}
              >
                <Edit className="w-3 h-3" />
              </Button>
            )}
            <Badge 
              variant="outline"
              className={`text-white ${getStatusColor(listing.status)}`}
            >
              {listing.status}
            </Badge>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold line-clamp-2 text-foreground">
          {listing.title}
        </h3>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Building className="w-4 h-4 mr-1" />
          {listing.agency}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {listing.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 mr-1 text-green-500" />
              <span className="font-semibold text-foreground">{formatCurrency(listing.value)}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {listing.category}
            </Badge>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            Deadline: {formatDate(listing.deadline)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleViewDetails}
        >
          <FileText className="w-4 h-4 mr-1" />
          View Details
        </Button>
        {isViewingOwnProfile && (
          <>
            {listing.status === 'Active' && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onRequestChange(listing)}
              >
                Request Changes
              </Button>
            )}
            {(listing.status === 'Pending' || listing.status === 'Rejected') && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEditListing(listing)}
              >
                Edit
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileListingCard;
