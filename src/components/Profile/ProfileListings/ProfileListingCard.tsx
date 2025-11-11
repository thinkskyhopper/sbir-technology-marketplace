
import { Building, Calendar, DollarSign, FileText, Edit } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
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

  const isSold = listing.status === 'Sold';

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      case 'Sold':
        return 'sold';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeClassName = (status: string) => {
    if (status === 'Active') {
      return 'bg-green-600 hover:bg-green-700 text-white border-transparent';
    }
    return '';
  };

  const cardClassName = isSold 
    ? "card-hover bg-card border-border relative" 
    : "card-hover bg-card border-border";

  return (
    <TooltipProvider>
      <Card className={cardClassName}>
      {/* Blur overlay for sold listings */}
      {isSold && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-lg z-10" />
      )}
      
      {/* Sold overlay content */}
      {isSold && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
          <Badge 
            variant="sold" 
            className="font-bold text-lg px-6 py-3 mb-4"
          >
            SOLD
          </Badge>
          {listing.technology_summary && (
            <div className="text-center">
              <p className="text-sm font-medium text-blue-400 mb-1">Technology:</p>
              <p className="text-lg font-bold text-foreground">{listing.technology_summary}</p>
            </div>
          )}
        </div>
      )}

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
              variant={getStatusBadgeVariant(listing.status)}
              className={getStatusBadgeClassName(listing.status)}
            >
              {listing.status}
            </Badge>
          </div>
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="text-lg font-semibold line-clamp-2 text-foreground cursor-help">
              {listing.title}
            </h3>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-sm">{listing.title}</p>
          </TooltipContent>
        </Tooltip>
        
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
        </div>
      </CardContent>

      <CardFooter className="pt-3 space-x-2">
        {isSold ? (
          <div className="flex-1" />
        ) : (
          <>
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
                {listing.status === 'Sold' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onRequestChange(listing)}
                  >
                    Request Deletion
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
          </>
        )}
      </CardFooter>
    </Card>
    </TooltipProvider>
  );
};

export default ProfileListingCard;
