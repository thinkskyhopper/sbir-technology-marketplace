
import { Card, CardContent } from "@/components/ui/card";

interface ListingDetailHeroImageProps {
  listing: {
    category: string;
    agency: string;
  };
}

const ListingDetailHeroImage = ({ listing }: ListingDetailHeroImageProps) => {
  const getListingImage = () => {
    const categoryLower = listing.category.toLowerCase();
    
    console.log('Category for image selection:', listing.category, 'Lowercase:', categoryLower);
    
    if (categoryLower.includes('cyber') || categoryLower.includes('security')) {
      return "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (categoryLower.includes('software') || categoryLower.includes('ai') || categoryLower.includes('data')) {
      return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (categoryLower.includes('hardware') || categoryLower.includes('electronic')) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (categoryLower.includes('autonomous')) {
      return "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (categoryLower.includes('biomedical') || categoryLower.includes('medical')) {
      return "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (categoryLower.includes('quantum')) {
      return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (categoryLower.includes('space')) {
      return "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (categoryLower.includes('advanced materials') || categoryLower.includes('materials')) {
      console.log('Matched Advanced Materials category');
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else {
      console.log('Using default image for category:', categoryLower);
      return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    }
  };

  const imageUrl = getListingImage();
  console.log('Selected image URL:', imageUrl);

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
