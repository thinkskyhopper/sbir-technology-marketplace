
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericContactDialog from "./GenericContactDialog";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const navigate = useNavigate();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const handleMarketplaceClick = () => {
    navigate('/?view=marketplace');
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

  const handleTeamClick = () => {
    navigate('/team');
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
            {/* Copyright */}
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm text-muted-foreground">
                © 2025 The SBIR Tech Marketplace. All rights reserved.
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-4">
              <button 
                onClick={handleHomeClick}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Home
              </button>
              <Separator orientation="vertical" className="h-4" />
              <button 
                onClick={handleMarketplaceClick}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Marketplace
              </button>
              <Separator orientation="vertical" className="h-4" />
              <button 
                onClick={handleLearnMoreClick}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Learn More
              </button>
              <Separator orientation="vertical" className="h-4" />
              <button 
                onClick={handleLegalDisclaimerClick}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Legal Disclaimer
              </button>
              <Separator orientation="vertical" className="h-4" />
              <button 
                onClick={handlePrivacyPolicyClick}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Privacy Policy
              </button>
              <Separator orientation="vertical" className="h-4" />
              <button 
                onClick={handleTeamClick}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Our Team
              </button>
              <Separator orientation="vertical" className="h-4" />
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
