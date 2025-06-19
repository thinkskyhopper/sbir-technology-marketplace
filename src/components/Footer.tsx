
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericContactDialog from "./GenericContactDialog";

const Footer = () => {
  const navigate = useNavigate();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const handlePrivacyPolicyClick = () => {
    navigate('/privacy-policy');
    window.scrollTo(0, 0);
  };

  const handleLegalDisclaimerClick = () => {
    navigate('/legal-disclaimer');
    window.scrollTo(0, 0);
  };

  const handleLearnMoreClick = () => {
    navigate('/expert-value');
    window.scrollTo(0, 0);
  };

  const handleContactUsClick = () => {
    setContactDialogOpen(true);
  };

  return (
    <>
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gradient">The SBIR Tech Marketplace</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-8">
              <button 
                onClick={handleHomeClick}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={handlePrivacyPolicyClick}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Privacy Policy
              </button>
              <button 
                onClick={handleLegalDisclaimerClick}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Legal Disclaimer
              </button>
              <button 
                onClick={handleLearnMoreClick}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Learn More
              </button>
              <button 
                onClick={handleContactUsClick}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Contact Us
              </button>
            </nav>
          </div>
        </div>
      </footer>

      <GenericContactDialog 
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        title="Contact Us"
      />
    </>
  );
};

export default Footer;
