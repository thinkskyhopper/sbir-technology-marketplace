import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  display_email: string | null;
  company_name: string | null;
  bio: string | null;
  role: string;
  notification_categories: string[] | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  isAdmin: boolean;
}

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

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 fetchProfile starting for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('📊 Profile query result:', { data, error });

      if (error) {
        console.error('❌ Error fetching profile:', error);
        
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, creating new profile...');
          const { data: userData } = await supabase.auth.getUser();
          console.log('👤 Current user data:', userData);
          
          if (userData.user) {
            const newProfileData = {
              id: userId,
              email: userData.user.email || '',
              full_name: userData.user.user_metadata?.full_name || null,
              display_email: userData.user.email || '',
              role: 'user' as const
            };
            
            console.log('📝 Creating profile with data:', newProfileData);
            
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfileData)
              .select()
              .single();

            console.log('📝 Profile creation result:', { newProfile, createError });

            if (createError) {
              console.error('❌ Error creating profile:', createError);
              throw createError;
            } else {
              console.log('✅ Profile created successfully:', newProfile);
              const transformedProfile: Profile = {
                ...newProfile,
                notification_categories: Array.isArray(newProfile.notification_categories) 
                  ? newProfile.notification_categories as string[]
                  : []
              };
              setProfile(transformedProfile);
              setIsAdmin(newProfile.role === 'admin');
              return;
            }
          } else {
            console.error('❌ No user data available for profile creation');
            throw new Error('No user data available');
          }
        }
        
        throw error;
      }
      
      // Transform the data to match our Profile interface
      const transformedProfile: Profile = {
        ...data,
        notification_categories: Array.isArray(data.notification_categories) 
          ? data.notification_categories as string[]
          : []
      };
      
      console.log('✅ Profile fetched successfully:', transformedProfile);
      setProfile(transformedProfile);
      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('💥 Fatal error in fetchProfile:', error);
      setProfile(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Setting up auth state listener...');
    
    // Check for existing session first
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
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const getCurrentUrl = () => {
    // Get the current URL from window.location
    const currentUrl = window.location.href;
    console.log('Current full URL:', currentUrl);
    
    // Extract protocol, hostname, and port
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port || (protocol === 'https:' ? '443' : '80');
    
    console.log('URL components:', { protocol, hostname, port });
    
    // For development, use the detected port
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:${port}`;
    }
    
    // For production, use origin
    return window.location.origin;
  };

  const getRedirectUrl = () => {
    const baseUrl = getCurrentUrl();
    const redirectUrl = `${baseUrl}/auth?mode=reset`;
    console.log('Generated redirect URL:', redirectUrl);
    return redirectUrl;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${getCurrentUrl()}/`;
    
    console.log('Sign up attempt for:', email, 'with redirect:', redirectUrl);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Sign in attempt for:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Sign in error:', error);
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('Sign out initiated');
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = getRedirectUrl();
    
    console.log('Password reset request for:', email, 'with redirect:', redirectUrl);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    if (error) {
      console.error('Password reset error:', error);
    }
    
    return { error };
  };

  const updatePassword = async (password: string) => {
    console.log('Password update attempt');
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    
    if (error) {
      console.error('Password update error:', error);
    }
    
    return { error };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
