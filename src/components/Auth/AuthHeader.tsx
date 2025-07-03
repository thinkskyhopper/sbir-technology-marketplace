
import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="block hover:opacity-80 transition-opacity">
        <img 
          src="/lovable-uploads/7afd0c6e-c779-4f57-ae36-08540adc4f01.png" 
          alt="The SBIR Tech Marketplace"
          className="w-full max-w-sm mx-auto h-auto object-contain"
        />
      </Link>
      <p className="text-muted-foreground mt-4">Secure marketplace for SBIR technology</p>
    </div>
  );
};

export default AuthHeader;
