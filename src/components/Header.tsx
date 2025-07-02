
import { Search, Plus, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import HeaderUserMenu from "./Header/HeaderUserMenu";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onPostListingClick?: () => void;
  onShowBookmarkedListings?: () => void;
}

const Header = ({ onSearch, onPostListingClick, onShowBookmarkedListings }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handlePostListing = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to post a listing",
        variant: "destructive",
      });
      return;
    }
    
    if (onPostListingClick) {
      onPostListingClick();
    }
  };

  const handleBookmarkedListings = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to view your bookmarks",
        variant: "destructive",
      });
      return;
    }
    
    if (onShowBookmarkedListings) {
      onShowBookmarkedListings();
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // Only show search on home page
  const showSearch = location.pathname === '/';

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="text-xl sm:text-2xl font-bold text-primary cursor-pointer" 
            onClick={handleLogoClick}
          >
            SBIR Marketplace
          </div>

          {/* Search - only on home page */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search listings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Bookmarked Listings Button - only show if user is signed in */}
            {user && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBookmarkedListings}
                className="hidden sm:flex"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmarked Listings
              </Button>
            )}

            {/* Mobile Bookmarked Listings Button */}
            {user && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleBookmarkedListings}
                className="sm:hidden h-8 w-8"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            )}
            
            {/* Post Listing Button */}
            <Button 
              onClick={handlePostListing}
              size="sm"
              className="hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Listing
            </Button>

            {/* Mobile Post Listing Button */}
            <Button 
              onClick={handlePostListing}
              size="icon"
              className="sm:hidden h-8 w-8"
            >
              <Plus className="w-4 h-4" />
            </Button>

            <HeaderUserMenu />
          </div>
        </div>

        {/* Mobile Search - only on home page */}
        {showSearch && (
          <div className="md:hidden mt-3">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
