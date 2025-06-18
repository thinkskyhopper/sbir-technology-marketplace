import { Card, CardContent } from "@/components/ui/card";

interface ListingDetailHeroImageProps {
  listing: {
    category: string;
    agency: string;
    photo_url?: string;
    title: string;
  };
}

const ListingDetailHeroImage = ({ listing }: ListingDetailHeroImageProps) => {
  const getListingImage = () => {
    // If there's an uploaded photo, use it
    if (listing.photo_url) {
      return listing.photo_url;
    }

    // Otherwise, fall back to category-based placeholder images
    const category = listing.category.toLowerCase();
    const agency = listing.agency.toLowerCase();
    
    if (category.includes('cyber') || category.includes('security')) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (category.includes('software') || category.includes('ai') || category.includes('data')) {
      return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (category.includes('hardware') || category.includes('electronic')) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else if (agency.includes('navy') || agency.includes('air force') || agency.includes('army')) {
      return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    } else {
      return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";
    }
  };

  const getImageAlt = () => {
    if (listing.photo_url) {
      return `Photo for ${listing.title}`;
    }
    return `${listing.category} contract visualization`;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <img 
          src={getListingImage()} 
          alt={getImageAlt()}
          className="w-full h-64 object-cover rounded-lg"
        />
      </CardContent>
    </Card>
  );
};

export default ListingDetailHeroImage;
