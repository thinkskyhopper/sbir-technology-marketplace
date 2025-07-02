
import { Search, Plus, Bookmark, LogIn } from "lucide-react";
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
  const { user, isAdmin, profile } = useAuth();
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
    
    // Navigate to dedicated bookmarks page
    navigate('/bookmarks');
  };

  const handleLogoClick = () => {
    console.log("Logo clicked - navigating to homepage");
    console.log("Current location:", location.pathname);
    console.log("Current search params:", location.search);
    
    // Always navigate to homepage and clear all parameters
    navigate('/');
    // Ensure scroll to top after navigation
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  // Check if user can submit listings (admins always can, others based on profile setting)
  const canSubmitListings = isAdmin || (profile?.can_submit_listings ?? false);

  // Only show search on home page
  const showSearch = location.pathname === '/';

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0" 
            onClick={handleLogoClick}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs sm:text-sm">S</span>
            </div>
            <span className="text-sm sm:text-xl font-bold text-gradient hidden xs:block sm:block">
              The SBIR Tech Marketplace
            </span>
            <span className="text-sm font-bold text-gradient block xs:hidden sm:hidden">
              TSTM
            </span>
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
            {user ? (
              <>
                {/* Bookmarked Listings Button - show if user is signed in */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBookmarkedListings}
                  className="hidden sm:flex border-primary/20 hover:border-primary/40"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmarks
                </Button>

                {/* Mobile Bookmarked Listings Button */}
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleBookmarkedListings}
                  className="sm:hidden h-8 w-8 border-primary/20 hover:border-primary/40"
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
                
                {/* Post Listing Button - only show if user can submit listings */}
                {canSubmitListings && (
                  <>
                    <Button 
                      onClick={handlePostListing}
                      size="sm"
                      className="hidden sm:flex bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Listing
                    </Button>

                    {/* Mobile Post Listing Button */}
                    <Button 
                      onClick={handlePostListing}
                      size="icon"
                      className="sm:hidden h-8 w-8 bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </>
                )}

                <HeaderUserMenu />
              </>
            ) : (
              <>
                {/* Login Button */}
                <Button 
                  onClick={handleAuthClick} 
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </>
            )}
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
