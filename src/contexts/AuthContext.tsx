
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, AuthContextType } from './auth/types';
import { fetchProfile } from './auth/profileOperations';
import * as authOps from './auth/authOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('🚀 Setting up auth state listener...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User authenticated, fetching profile...');
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(() => {
            fetchProfile(session.user.id, setProfile, setIsAdmin);
          }, 0);
        } else {
          console.log('🚪 No user session, clearing profile...');
          setProfile(null);
          setIsAdmin(false);
        }
        
        // Always set loading to false after processing auth change
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting session:', error);
        setLoading(false);
        return;
      }
      
      console.log('🔍 Initial session check:', session?.user?.email || 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 Initial user found, fetching profile...');
        // Use setTimeout to avoid blocking
        setTimeout(() => {
          fetchProfile(session.user.id, setProfile, setIsAdmin);
        }, 0);
      } else {
        console.log('🚪 No initial session found');
        setProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    profile,
    loading,
    signUp: authOps.signUp,
    signIn: authOps.signIn,
    signOut: authOps.signOut,
    resetPassword: authOps.resetPassword,
    updatePassword: authOps.updatePassword,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
