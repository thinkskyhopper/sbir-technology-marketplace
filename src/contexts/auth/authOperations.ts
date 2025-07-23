
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

export const signInWithGoogle = async () => {
  try {
    console.log('🚀 [STEP 1] Starting Google OAuth flow...');
    console.log('📍 Current URL:', window.location.href);
    console.log('🏠 Redirect URL will be:', `${getCurrentUrl()}/`);
    
    // Check Supabase client configuration
    console.log('🔧 [STEP 2] Checking Supabase client configuration...');
    console.log('📡 Supabase project ready');
    
    // Test network connectivity to Supabase
    console.log('🌐 [STEP 3] Testing Supabase connectivity...');
    
    // Add additional metadata for new users
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getCurrentUrl()}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      console.error('❌ [STEP 4] Google OAuth error:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
      
      // Provide more helpful error messages for common issues
      if (error.message?.includes('403')) {
        console.error('🚨 403 Error detected - this could be due to:');
        console.error('   1. Missing RLS policies for profile creation');
        console.error('   2. Google OAuth app not properly configured');
        console.error('   3. Redirect URL mismatch');
        console.error('   4. Profile creation trigger failure');
      }
      
      return { error };
    }

    console.log('✅ [STEP 4] Google OAuth initiated successfully');
    console.log('📊 OAuth response data:', data);
    console.log('🔄 [STEP 5] Browser should now redirect to Google...');
    console.log('🎯 Expected flow: Google login → consent → redirect to Supabase → redirect back to app');
    console.log('🔍 Note: After successful auth, check for profile creation in database');
    
    return { error: null };
  } catch (err) {
    console.error('💥 [STEP 4] Google OAuth exception:', err);
    console.error('🔍 Exception details:', {
      name: err instanceof Error ? err.name : 'Unknown',
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined
    });
    
    // Enhanced error handling for specific cases
    if (err instanceof Error && err.message?.includes('403')) {
      console.error('🚨 Specific 403 error handling:');
      console.error('   This usually means the user was created in auth.users but profile creation failed');
      console.error('   Check if the handle_new_user trigger is working and RLS policies allow INSERT');
    }
    
    return { error: err };
  }
};
