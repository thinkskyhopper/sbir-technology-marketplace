
import { useAuth } from "@/contexts/AuthContext";
import HeaderLogo from "./Header/HeaderLogo";
import HeaderSearch from "./Header/HeaderSearch";
import HeaderBookmarks from "./Header/HeaderBookmarks";
import HeaderPostListing from "./Header/HeaderPostListing";
import HeaderAuthButtons from "./Header/HeaderAuthButtons";
import HeaderUserMenu from "./Header/HeaderUserMenu";
import NotificationDropdown from "./NotificationDropdown";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onPostListingClick?: () => void;
  onShowBookmarkedListings?: () => void;
}

const Header = ({ onSearch, onPostListingClick }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <HeaderLogo isMobile={false} />

          {/* Search */}
          <HeaderSearch onSearch={onSearch} />

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3" role="group" aria-label="User actions">
            {user ? (
              <>
                <HeaderBookmarks />
                <HeaderPostListing onPostListingClick={onPostListingClick} />
                <NotificationDropdown />
                <HeaderUserMenu />
              </>
            ) : (
              <HeaderAuthButtons />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
