
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDefaultCategoryImage } from "@/utils/categoryDefaultImages";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminSettings } from "@/hooks/useAdminSettings";

interface ListingDetailHeroImageProps {
  listing: {
    category: string;
    agency: string;
    phase: string;
    photo_url?: string;
  };
}

const ListingDetailHeroImage = ({ listing }: ListingDetailHeroImageProps) => {
  const { isAdmin } = useAuth();
  const { settings } = useAdminSettings();
  const hasCustomImage = listing.photo_url && listing.photo_url.trim() !== '';
  const imageUrl = hasCustomImage ? listing.photo_url : getDefaultCategoryImage(listing.category);
  
  // Get badge corner position from admin settings, default to top-right
  const badgeCorner = settings.phase_iii_badge_corner || 'top-right';
  
  console.log('Hero image details:', { 
    hasCustomImage, 
    photoUrl: listing.photo_url, 
    category: listing.category, 
    phase: listing.phase,
    badgeCorner,
    finalImageUrl: imageUrl 
  });

  // Helper function to get position classes based on corner setting
  const getBadgePositionClasses = (corner: string) => {
    switch (corner) {
      case 'top-left':
        return 'top-2 left-2';
      case 'top-right':
        return 'top-2 right-2';
      case 'bottom-left':
        return 'bottom-2 left-2';
      case 'bottom-right':
        return 'bottom-2 right-2';
      default:
        return 'top-2 right-2';
    }
  };

  return (
    <Card className="relative">
      <CardContent className="p-0">
        <div className={hasCustomImage ? "relative w-full" : "relative w-full h-64"}>
          <img 
            src={imageUrl} 
            alt={`${listing.category} contract visualization`}
            className={hasCustomImage 
              ? "w-full max-h-64 object-contain rounded-lg bg-muted" 
              : "w-full h-64 object-cover rounded-lg"
            }
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              console.error('Error event:', e);
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', imageUrl);
            }}
          />
          
          {/* Phase III Badge */}
          {listing.phase === 'Phase III' && (
            <div className={`absolute ${getBadgePositionClasses(badgeCorner)} z-10`}>
              <Badge 
                variant="phase" 
                className="bg-purple-600 text-white border-2 border-white shadow-lg font-bold px-3 py-1 text-sm"
              >
                Phase III
              </Badge>
            </div>
          )}
          
          {/* Custom image indicator for admins only */}
          {isAdmin && hasCustomImage && (
            <Badge 
              variant="secondary" 
              className={`absolute ${listing.phase === 'Phase III' ? 'top-2 left-2' : 'top-2 right-2'} bg-blue-500 text-white`}
            >
              Custom Image
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingDetailHeroImage;
