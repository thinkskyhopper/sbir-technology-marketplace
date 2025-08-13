
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderLogoProps {
  isMobile: boolean;
}

const HeaderLogo = ({ isMobile }: HeaderLogoProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    console.log("Logo clicked - navigating to homepage");
    console.log("Current location:", location.pathname);
    console.log("Current search params:", location.search);
    
    // Check if we're on the actual homepage (no view parameter or view=home)
    const searchParams = new URLSearchParams(location.search);
    const currentView = searchParams.get('view');
    const isOnHomepage = location.pathname === '/' && (!currentView || currentView === 'home');
    
    if (isOnHomepage) {
      // If already on homepage, just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to homepage (clear all parameters) and scroll to top
      navigate('/');
      // Ensure scroll to top after navigation
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
  };

  return (
    <button 
      className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0 bg-transparent border-none p-0" 
      onClick={handleLogoClick}
      aria-label="Go to homepage"
      type="button"
    >
      <img 
        src="/lovable-uploads/ca0d11df-91c3-48f4-8ef8-34b8eaf8bbbf.png" 
        alt="SBIR Logo"
        className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
      />
      <span className="text-sm sm:text-xl font-bold hidden xs:block sm:block">
        <span className="text-gradient">The SBIR Tech </span>
        <span className="text-foreground">Marketplace</span>
      </span>
    </button>
  );
};

export default HeaderLogo;
