
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderSearchProps {
  onSearch?: (query: string) => void;
  isMobile: boolean;
}

const HeaderSearch = ({ onSearch, isMobile }: HeaderSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
    if (isMobile) {
      setShowMobileSearch(false);
    }
  };

  // Mobile search overlay
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
    <>
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
    </>
  );
};

export default HeaderSearch;
