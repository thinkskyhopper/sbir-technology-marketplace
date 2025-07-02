
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
    <div 
      className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0" 
      onClick={handleLogoClick}
    >
      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-sm flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-xs sm:text-sm">S</span>
      </div>
      <img 
        src="/lovable-uploads/355833e5-de70-40de-940a-7325588d3163.png" 
        alt="The SBIR Tech Marketplace"
        className="h-6 sm:h-8 w-auto max-w-[200px] sm:max-w-[250px] object-contain"
      />
    </div>
  );
};

export default HeaderLogo;
