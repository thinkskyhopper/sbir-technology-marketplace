
import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="block hover:opacity-80 transition-opacity">
        <img 
          src="/lovable-uploads/a0bc0247-5d41-40e0-b2ca-3c6aae467056.png" 
          alt="The SBIR Tech Marketplace"
          className="w-full max-w-sm mx-auto h-auto object-contain"
        />
      </Link>
      <p className="text-muted-foreground mt-4">Secure marketplace for SBIR technology</p>
    </div>
  );
};

export default AuthHeader;
