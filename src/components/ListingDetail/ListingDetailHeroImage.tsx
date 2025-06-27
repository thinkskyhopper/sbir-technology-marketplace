
import { Card, CardContent } from "@/components/ui/card";
import { getDefaultCategoryImage } from "@/utils/categoryDefaultImages";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";

interface ListingDetailHeroImageProps {
  listing: {
    category: string;
    agency: string;
    photo_url?: string;
  };
}

const ListingDetailHeroImage = ({ listing }: ListingDetailHeroImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use custom photo if available and no error, otherwise fall back to default
  const shouldUseCustomImage = listing.photo_url && !imageError;
  const imageUrl = shouldUseCustomImage 
    ? listing.photo_url 
    : getDefaultCategoryImage(listing.category);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.error('Custom image failed to load:', listing.photo_url);
    setImageError(true);
    setIsLoading(false);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <img 
            src={imageUrl}
            alt={`${listing.category} contract visualization`}
            className="w-full h-full object-cover rounded-lg"
            onLoad={handleImageLoad}
            onError={shouldUseCustomImage ? handleImageError : handleImageLoad}
            style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.2s' }}
          />
          
          {/* Custom image indicator */}
          {shouldUseCustomImage && !isLoading && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
              Custom Image
            </div>
          )}
          
          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
          )}
        </AspectRatio>
      </CardContent>
    </Card>
  );
};

export default ListingDetailHeroImage;
