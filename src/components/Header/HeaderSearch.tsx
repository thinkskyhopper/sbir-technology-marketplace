
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";

interface HeaderSearchProps {
  onSearch?: (query: string) => void;
}

const HeaderSearch = ({ onSearch }: HeaderSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
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

      {/* Mobile Search */}
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
    </>
  );
};

export default HeaderSearch;
