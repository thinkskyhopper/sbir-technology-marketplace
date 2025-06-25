
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
      <Link to="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
        The SBIR Tech Marketplace
      </Link>
      <p className="text-muted-foreground">Secure marketplace for SBIR technology</p>
    </div>
  );
};

export default AuthHeader;
