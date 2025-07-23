
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MarketplaceCard from "./MarketplaceCard";
import { useBookmarks } from "@/hooks/useBookmarks";
import type { SBIRListing } from "@/types/listings";

const BookmarkedListings = () => {
  const { fetchBookmarkedListings, bookmarkedListings: bookmarkIds } = useBookmarks();
  const [bookmarkedListings, setBookmarkedListings] = useState<SBIRListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadBookmarkedListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const listings = await fetchBookmarkedListings();
      setBookmarkedListings(listings);
    } catch (error) {
      console.error('Error loading bookmarked listings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchBookmarkedListings]);

  // Load bookmarked listings on mount and when bookmark IDs change
  useEffect(() => {
    loadBookmarkedListings();
  }, [bookmarkIds]);

  const handleBackToMarketplace = () => {
    navigate("/?view=marketplace");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={handleBackToMarketplace}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>
        
        <div className="text-center py-12">
          <p>Loading your bookmarked listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Button 
        variant="ghost" 
        onClick={handleBackToMarketplace}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Marketplace
      </Button>
      
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Your Bookmarked Listings</h1>
        </div>
        <p className="text-muted-foreground">
          {bookmarkedListings.length === 0 
            ? "You haven't bookmarked any listings yet" 
            : `${bookmarkedListings.length} bookmarked listing${bookmarkedListings.length === 1 ? '' : 's'}`
          }
        </p>
      </div>

      {bookmarkedListings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookmarked listings</h3>
            <p className="text-muted-foreground mb-6">
              Start browsing listings and bookmark the ones you're interested in to see them here.
            </p>
            <Button onClick={handleBackToMarketplace}>
              Browse Listings
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedListings.map((listing) => (
            <MarketplaceCard
              key={listing.id}
              listing={listing}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedListings;
