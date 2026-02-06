
import React, { useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading, profileLoading, isAdmin } = useAuth();
  const wasAuthenticatedRef = useRef(false);
  const gracePeriodTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track authentication state and handle grace period
  useEffect(() => {
    // Clear any existing timeout
    if (gracePeriodTimeoutRef.current) {
      clearTimeout(gracePeriodTimeoutRef.current);
      gracePeriodTimeoutRef.current = null;
    }

    if (user) {
      // User is authenticated
      wasAuthenticatedRef.current = true;
    } else if (!loading && wasAuthenticatedRef.current) {
      // User became null but was previously authenticated - start grace period
      console.log('🕐 Starting auth grace period...');
      gracePeriodTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Auth grace period expired');
        wasAuthenticatedRef.current = false;
      }, 1500); // 1.5 second grace period
    }

    // Cleanup on unmount
    return () => {
      if (gracePeriodTimeoutRef.current) {
        clearTimeout(gracePeriodTimeoutRef.current);
      }
    };
  }, [user, loading]);

  if (import.meta.env.DEV) {
    console.log('ProtectedRoute render:', { 
      user: user?.email, 
      loading, 
      profileLoading,
      isAdmin, 
      requireAdmin,
    });
  }

  // Use stable wrapper to prevent render tree changes
  return (
    <div className="relative">
      {loading && (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}

      {!loading && !user && !wasAuthenticatedRef.current && (
        <Navigate to="/auth" replace />
      )}

      {!loading && !profileLoading && user && requireAdmin && !isAdmin && (
        <Navigate to="/" replace />
      )}

      {!loading && (user || wasAuthenticatedRef.current) && (
        <>
          {children}
          
          {/* Admin permission check overlay */}
          {requireAdmin && user && profileLoading && (
            <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Checking permissions...</p>
              </div>
            </div>
          )}

          {/* Grace period overlay */}
          {!user && wasAuthenticatedRef.current && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Reconnecting...</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProtectedRoute;
