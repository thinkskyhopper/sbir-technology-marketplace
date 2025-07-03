
import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <img 
          src="/lovable-uploads/8f82ed4a-36a0-46a2-a97b-78231a3a786e.png" 
          alt="SBIR Logo"
          className="w-16 h-16 object-contain"
        />
      </div>
      <Link to="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
        The SBIR Tech Marketplace
      </Link>
      <p className="text-muted-foreground">Secure marketplace for SBIR technology</p>
    </div>
  );
};

export default AuthHeader;
