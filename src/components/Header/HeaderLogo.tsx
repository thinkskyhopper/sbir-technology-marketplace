
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

  return (
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
  );
};

export default HeaderLogo;
