
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUrl, getRedirectUrl } from './urlUtils';

export const signUp = async (email: string, password: string, fullName: string) => {
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

export const signIn = async (email: string, password: string) => {
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

export const signOut = async () => {
  console.log('Sign out initiated');
  await supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
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

export const updatePassword = async (password: string) => {
  console.log('Password update attempt');
  
  const { error } = await supabase.auth.updateUser({
    password: password
  });
  
  if (error) {
    console.error('Password update error:', error);
  }
  
  return { error };
};
