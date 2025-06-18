
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Shield, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GenericContactDialog from "@/components/GenericContactDialog";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onPostListingClick?: () => void;
}

const Header = ({ onSearch, onPostListingClick }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for contact dialog events from footer
  useEffect(() => {
    const handleOpenContact = () => {
      setShowContactDialog(true);
    };

    window.addEventListener('openContactDialog', handleOpenContact);
    return () => window.removeEventListener('openContactDialog', handleOpenContact);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isOnHomePage = location.pathname === "/";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl hidden sm:inline">SBIR Tech</span>
          </Link>

          {/* Search Bar - Only show on home page */}
          {isOnHomePage && onSearch && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search SBIR technology..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/expert-value">
              <Button variant="ghost">Learn More</Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => setShowContactDialog(true)}
            >
              Contact Us
            </Button>
            
            {user ? (
              <>
                <Button onClick={onPostListingClick} variant="outline">
                  Post Listing
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-sm text-muted-foreground">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Panel
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container mx-auto px-6 py-4 space-y-4">
              {/* Mobile Search - Only show on home page */}
              {isOnHomePage && onSearch && (
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search SBIR technology..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </form>
              )}
              
              <div className="flex flex-col space-y-2">
                <Link to="/expert-value">
                  <Button variant="ghost" className="w-full justify-start">
                    Learn More
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    setShowContactDialog(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Contact Us
                </Button>
                
                {user ? (
                  <>
                    <Button 
                      onClick={() => {
                        if (onPostListingClick) onPostListingClick();
                        setIsMenuOpen(false);
                      }} 
                      variant="outline" 
                      className="w-full"
                    >
                      Post Listing
                    </Button>
                    {isAdmin && (
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => {
                          navigate('/admin');
                          setIsMenuOpen(false);
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                    <div className="text-sm text-muted-foreground px-3 py-2">
                      {user.email}
                    </div>
                  </>
                ) : (
                  <Button asChild className="w-full">
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <GenericContactDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
      />
    </>
  );
};

export default Header;
