
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDefaultCategoryImage } from "@/utils/categoryDefaultImages";
import { useAuth } from "@/contexts/AuthContext";

interface ListingDetailHeroImageProps {
  listing: {
    category: string;
    agency: string;
    photo_url?: string;
  };
}

const ListingDetailHeroImage = ({ listing }: ListingDetailHeroImageProps) => {
  const { isAdmin } = useAuth();
  const hasCustomImage = listing.photo_url && listing.photo_url.trim() !== '';
  const imageUrl = hasCustomImage ? listing.photo_url : getDefaultCategoryImage(listing.category);
  
  console.log('Hero image details:', { 
    hasCustomImage, 
    photoUrl: listing.photo_url, 
    category: listing.category, 
    finalImageUrl: imageUrl 
  });

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
          
          {/* Custom image indicator for admins only */}
          {isAdmin && hasCustomImage && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-2 bg-blue-500 text-white"
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
