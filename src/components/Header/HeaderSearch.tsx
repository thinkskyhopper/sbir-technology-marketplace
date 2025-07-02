
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderSearchProps {
  onSearch?: (query: string) => void;
}

const HeaderSearch = ({ onSearch }: HeaderSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Only show search on home page
  const showSearch = location.pathname === '/';

  if (!showSearch) return null;

  return (
    <>
      {/* Desktop Search */}
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

      {/* Mobile Search Icon */}
      <div className="md:hidden">
        {!showMobileSearch ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMobileSearchToggle}
            className="h-8 w-8"
          >
            <Search className="w-4 h-4" />
          </Button>
        ) : (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-2">
                <form onSubmit={handleSearchSubmit} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search listings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4"
                      autoFocus
                    />
                  </div>
                </form>
                <Button
                  variant="ghost"
                  onClick={handleMobileSearchToggle}
                  className="shrink-0"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HeaderSearch;
