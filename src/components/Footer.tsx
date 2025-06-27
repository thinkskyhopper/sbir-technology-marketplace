
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
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {/* Copyright */}
            <div className="flex flex-col items-center">
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                © 2025 The SBIR Tech Marketplace. All rights reserved.
              </p>
            </div>

            {/* Navigation Links - Mobile responsive grid */}
            <nav className="w-full">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <button 
                  onClick={handleHomeClick}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium py-1 px-2 rounded hover:bg-secondary/50"
                >
                  Home
                </button>
                <Separator orientation="vertical" className="h-3 sm:h-4 hidden sm:block" />
                <span className="text-muted-foreground/30 block sm:hidden">•</span>
                
                <button 
                  onClick={handleMarketplaceClick}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium py-1 px-2 rounded hover:bg-secondary/50"
                >
                  Marketplace
                </button>
                <Separator orientation="vertical" className="h-3 sm:h-4 hidden sm:block" />
                <span className="text-muted-foreground/30 block sm:hidden">•</span>
                
                <button 
                  onClick={handleLearnMoreClick}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium py-1 px-2 rounded hover:bg-secondary/50"
                >
                  Learn More
                </button>
                <Separator orientation="vertical" className="h-3 sm:h-4 hidden sm:block" />
                <span className="text-muted-foreground/30 block sm:hidden">•</span>
                
                <button 
                  onClick={handleLegalDisclaimerClick}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium py-1 px-2 rounded hover:bg-secondary/50"
                >
                  Legal Disclaimer
                </button>
                <Separator orientation="vertical" className="h-3 sm:h-4 hidden sm:block" />
                <span className="text-muted-foreground/30 block sm:hidden">•</span>
                
                <button 
                  onClick={handlePrivacyPolicyClick}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium py-1 px-2 rounded hover:bg-secondary/50"
                >
                  Privacy Policy
                </button>
                <Separator orientation="vertical" className="h-3 sm:h-4 hidden sm:block" />
                <span className="text-muted-foreground/30 block sm:hidden">•</span>
                
                <button 
                  onClick={handleTeamClick}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium py-1 px-2 rounded hover:bg-secondary/50"
                >
                  Our Team
                </button>
                <Separator orientation="vertical" className="h-3 sm:h-4 hidden sm:block" />
                <span className="text-muted-foreground/30 block sm:hidden">•</span>
                
                <button 
                  onClick={handleContactUsClick}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium py-1 px-2 rounded hover:bg-secondary/50"
                >
                  Contact Us
                </button>
              </div>
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
