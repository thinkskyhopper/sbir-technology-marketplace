
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (location.pathname === path) {
      // If already on the page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to the page and scroll to top
      navigate(path);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLearnMore = () => {
    handleNavigation('/expert-value');
  };

  const handleContactUs = () => {
    // For now, navigate to home with a contact parameter or create a contact page
    // Since there's no dedicated contact page, we'll navigate to expert-value which has contact functionality
    handleNavigation('/expert-value');
  };

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gradient">The SBIR Tech Marketplace</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <button 
              onClick={() => handleNavigation('/')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('/privacy-policy')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={handleLearnMore}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Learn More
            </button>
            <button 
              onClick={handleContactUs}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </button>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} The SBIR Tech Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
