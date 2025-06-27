
import { Card, CardContent } from "@/components/ui/card";
import { getDefaultCategoryImage } from "@/utils/categoryDefaultImages";

interface ListingDetailHeroImageProps {
  listing: {
    category: string;
    agency: string;
  };
}

const ListingDetailHeroImage = ({ listing }: ListingDetailHeroImageProps) => {
  const imageUrl = getDefaultCategoryImage(listing.category);
  console.log('Selected image URL for category', listing.category, ':', imageUrl);

  return (
    <Card>
      <CardContent className="p-0">
        <img 
          src={imageUrl} 
          alt={`${listing.category} contract visualization`}
          className="w-full h-64 object-cover rounded-lg"
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            console.error('Error event:', e);
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', imageUrl);
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ListingDetailHeroImage;
