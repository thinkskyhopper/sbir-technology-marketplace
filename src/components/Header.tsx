
import { useIsMobile } from "@/hooks/use-mobile";
import HeaderLogo from "./Header/HeaderLogo";
import HeaderSearch from "./Header/HeaderSearch";
import HeaderActions from "./Header/HeaderActions";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onPostListingClick?: () => void;
}

const Header = ({ onSearch, onPostListingClick }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <HeaderLogo isMobile={isMobile} />
          <HeaderSearch onSearch={onSearch} isMobile={isMobile} />
          <HeaderActions onPostListingClick={onPostListingClick} />
        </div>
      </div>
    </header>
  );
};

export default Header;
