
import { useMetaTags } from "@/hooks/useMetaTags";
import type { SBIRListing } from "@/types/listings";

export const useListingDetailMetaTags = (listing: SBIRListing | undefined) => {
  const getListingImage = () => {
    if (!listing) return '/lovable-uploads/9b10dc8b-2b29-49bd-b597-47744626af0d.png';
    
    const categoryLower = listing.category.toLowerCase();
    
    if (categoryLower.includes('cyber') || categoryLower.includes('security')) {
      return "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('software') || categoryLower.includes('ai') || categoryLower.includes('data')) {
      return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('hardware') || categoryLower.includes('electronic')) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('autonomous')) {
      return "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('biomedical') || categoryLower.includes('medical')) {
      return "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('quantum')) {
      return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('space')) {
      return "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else if (categoryLower.includes('advanced materials') || categoryLower.includes('materials')) {
      return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    } else {
      return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useMetaTags({
    title: listing ? `${listing.title} - SBIR Tech Marketplace` : 'The SBIR Tech Marketplace',
    description: listing ? 
      `${listing.phase} ${listing.category} project from ${listing.agency}. Value: ${formatCurrency(listing.value)}. ${listing.description.substring(0, 150)}...` : 
      'Helping generate revenue from past SBIR/STTR awards by connecting interested buyers, teaming partners and federal customers.',
    image: getListingImage(),
    url: listing ? `${window.location.origin}/listing/${listing.public_id || listing.id}` : window.location.href,
    type: 'article'
  });
};
