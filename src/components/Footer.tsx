
import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and branding */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">SBIR Tech Marketplace</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/privacy-policy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/expert-value" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Learn More
            </Link>
            <button 
              onClick={() => {
                // Scroll to top and trigger contact dialog
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Dispatch a custom event that can be caught by the header
                window.dispatchEvent(new CustomEvent('openContactDialog'));
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </button>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SBIR Tech Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
