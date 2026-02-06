
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, AuthContextType } from './auth/types';
import { fetchProfile } from './auth/profileOperations';
import * as authOps from './auth/authOperations';
import { toast } from 'sonner';

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
  const [profileLoading, setProfileLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) console.log('🚀 Setting up auth state listener...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (import.meta.env.DEV) {
          console.log('🔄 Auth state changed:', event, session ? 'Active' : 'No session');
        }
        
        if (event === 'SIGNED_OUT') {
          lastUserIdRef.current = null;
        }
        
        const prevUserId = lastUserIdRef.current;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const currentUserId = session.user.id;
          // Update ref early to reflect current session
          lastUserIdRef.current = currentUserId;

          if (event === 'TOKEN_REFRESHED' && prevUserId === currentUserId) {
            setProfileLoading(false);
          } else {
            setProfileLoading(true);
            // Use setTimeout to avoid blocking the auth state change
            setTimeout(async () => {
              try {
                await fetchProfile(currentUserId, setProfile, setIsAdmin);
              } catch (error) {
                if (error instanceof Error && error.message === 'ACCOUNT_DELETED') {
                  console.log('🚫 Forced logout due to deleted account');
                  toast.error('Account Deleted', {
                    description: 'This account has been deleted. If you believe this is an error, please contact support.',
                    duration: 6000,
                    className: 'bg-destructive text-destructive-foreground border-destructive'
                  });
                  // Clear all state - the auth state change handler will pick this up
                  setProfile(null);
                  setIsAdmin(false);
                  setSession(null);
                  setUser(null);
                  lastUserIdRef.current = null;
                }
              } finally {
                setProfileLoading(false);
              }
            }, 0);
          }
        } else {
          // Force clear all auth state
          setProfile(null);
          setIsAdmin(false);
          setProfileLoading(false);
          setSession(null);
          setUser(null);
          lastUserIdRef.current = null;
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
      
      if (import.meta.env.DEV) console.log('🔍 Initial session check:', session ? 'Session found' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setProfileLoading(true);
        setTimeout(async () => {
          try {
            await fetchProfile(session.user.id, setProfile, setIsAdmin);
          } catch (error) {
            if (error instanceof Error && error.message === 'ACCOUNT_DELETED') {
              console.log('🚫 Forced logout due to deleted account on initial load');
              toast.error('Account Deleted', {
                description: 'This account has been deleted. If you believe this is an error, please contact support.',
                duration: 6000,
                className: 'bg-destructive text-destructive-foreground border-destructive'
              });
              // Clear all state
              setProfile(null);
              setIsAdmin(false);
              setSession(null);
              setUser(null);
              lastUserIdRef.current = null;
            }
          } finally {
            setProfileLoading(false);
          }
        }, 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setProfileLoading(false);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    profile,
    loading,
    profileLoading,
    signUp: authOps.signUp,
    signIn: authOps.signIn,
    signOut: authOps.signOut,
    resetPassword: authOps.resetPassword,
    updatePassword: authOps.updatePassword,
    signInWithGoogle: authOps.signInWithGoogle,
    resendVerificationEmail: authOps.resendVerificationEmail,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
