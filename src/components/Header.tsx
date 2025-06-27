
import { Search, LogIn, Plus, LogOut, User, Shield, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onPostListingClick?: () => void;
}

const Header = ({
  onSearch,
  onPostListingClick
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const isMobile = useIsMobile();
  const {
    user,
    signOut,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
    if (isMobile) {
      setShowMobileSearch(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleLogoClick = () => {
    console.log("Logo clicked - navigating to homepage");
    console.log("Current location:", location.pathname);
    if (location.pathname === '/') {
      // If already on homepage, force a refresh by navigating away and back
      navigate('/temp', {
        replace: true
      });
      setTimeout(() => {
        navigate('/', {
          replace: true
        });
      }, 0);
    } else {
      navigate('/');
    }
  };

  if (showMobileSearch && isMobile) {
    return (
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={handleSearch} className="flex items-center space-x-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(false)}
              className="shrink-0"
            >
              ← Back
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-border"
                autoFocus
              />
            </div>
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
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
              SBIR
            </span>
          </div>

          {/* Desktop Search */}
          {!isMobile && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  className="pl-10 bg-secondary/50 border-border" 
                />
              </div>
            </form>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {/* Mobile Search Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileSearch(true)}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <Search className="w-4 h-4" />
              </Button>
            )}

            {user ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={onPostListingClick} 
                  className="border-primary/20 hover:border-primary/40 h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Post Listing</span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium truncate">{user.email}</div>
                      {isAdmin && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Shield className="w-3 h-3 mr-1" />
                          Administrator
                        </div>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem onClick={handleAdminClick}>
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={handleAuthClick} 
                className="bg-primary hover:bg-primary/90 h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-4"
              >
                <LogIn className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
