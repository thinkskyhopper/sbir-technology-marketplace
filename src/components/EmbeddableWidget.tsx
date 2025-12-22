
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { DollarSign, Building, FileText } from 'lucide-react';
import { featuredListingsService } from '@/services/featuredListings';
import type { SBIRListing } from '@/types/listings';

const EmbeddableWidget = () => {
  const [listings, setListings] = useState<SBIRListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewestListings = async () => {
      try {
        const homepageListings = await featuredListingsService.getHomepageListings();
        // Get the 3 newest listings
        setListings(homepageListings.slice(0, 3));
      } catch (error) {
        console.error('Error fetching listings for widget:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewestListings();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };


  const handleExploreClick = () => {
    window.open('https://thesbirtechmarketplace.com/', '_blank');
  };

  const handleLearnMoreClick = () => {
    window.open('https://thesbirtechmarketplace.com/', '_blank');
  };

  const handleViewDetailsClick = (listingId: string) => {
    window.open(`https://thesbirtechmarketplace.com/listing/${listingId}`, '_blank');
  };

  const handleViewAllClick = () => {
    window.open('https://thesbirtechmarketplace.com/?view=marketplace', '_blank');
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-md mx-auto bg-background border border-border rounded-lg p-4 font-sans sm:max-w-lg md:max-w-md">
      {/* Logo and Title */}
      <div className="text-center mb-4">
        <a 
          href="https://thesbirtechmarketplace.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src="/lovable-uploads/fe6674f8-0ad3-409f-ad77-bbca62b6a379.png" 
            alt="SBIR Logo"
            className="h-15 w-auto max-w-[90%] mx-auto mb-2 sm:h-20 lg:h-30"
          />
        </a>
        <h2 className="text-lg font-bold text-foreground sm:text-xl md:text-lg">
          <span className="text-gradient">The SBIR Tech </span>
          <span className="text-foreground">Marketplace</span>
        </h2>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <Button 
          onClick={handleExploreClick}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
        >
          Explore
        </Button>
        <Button 
          onClick={handleLearnMoreClick}
          variant="outline"
          className="flex-1"
          size="sm"
        >
          Learn More
        </Button>
      </div>

      {/* Listings */}
      <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto sm:max-h-none sm:overflow-y-visible">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Loading opportunities...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No opportunities available</p>
          </div>
        ) : (
          listings.map((listing) => (
            <Card key={listing.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-1">
                  <Badge variant="default" className="text-xs">
                    {listing.phase}
                  </Badge>
                  <Badge 
                    variant={listing.status === "Active" ? "default" : "outline"}
                    className={listing.status === "Active" ? "bg-green-600" : ""}
                  >
                    {listing.status}
                  </Badge>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href={`https://thesbirtechmarketplace.com/listing/${listing.public_id || listing.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline block"
                    >
                      <h3 className="text-sm font-semibold line-clamp-2 text-card-foreground sm:line-clamp-1">
                        {listing.title}
                      </h3>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">{listing.title}</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Building className="w-3 h-3 mr-1" />
                  <span className="truncate">{listing.agency}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {listing.description}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-xs">
                    <DollarSign className="w-3 h-3 mr-1 text-green-500" />
                    <span className="font-semibold text-card-foreground">{formatCurrency(listing.value)}</span>
                  </div>
                  <Badge variant="outline" className="text-xs max-w-20 truncate" title={listing.category}>
                    {listing.category}
                  </Badge>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline" 
                    size="sm" 
                    className="h-6 text-xs px-2 flex-shrink-0"
                    onClick={() => handleViewDetailsClick(listing.public_id || listing.id)}
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    <span className="hidden xs:inline">View Details</span>
                    <span className="xs:hidden">View</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View All Link */}
      <div className="text-center">
        <a
          href="https://thesbirtechmarketplace.com/?view=marketplace"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:text-primary/80 underline transition-colors"
        >
          View All Opportunities →
        </a>
      </div>
      </div>
    </TooltipProvider>
  );
};

export default EmbeddableWidget;
