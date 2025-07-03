
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUrl, getRedirectUrl } from './urlUtils';

export const signUp = async (email: string, password: string, fullName: string, marketingOptIn: boolean = false) => {
  const redirectUrl = `${getCurrentUrl()}/`;
  
  console.log('Sign up attempt for:', email, 'with redirect:', redirectUrl);
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
        marketing_emails_enabled: marketingOptIn
      }
    }
  });
  
  if (error) {
    console.error('Sign up error:', error);
    return { error };
  }

  // Send welcome email after successful signup
  try {
    console.log('Sending welcome email to:', email);
    
    const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        email: email,
        full_name: fullName
      }
    });
    
    if (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the signup if email sending fails
    } else {
      console.log('Welcome email sent successfully');
    }
  } catch (emailError) {
    console.error('Error sending welcome email:', emailError);
    // Don't fail the signup if email sending fails
  }
  
  return { error: null };
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
