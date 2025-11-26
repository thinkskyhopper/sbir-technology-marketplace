
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUrl, getRedirectUrl } from './urlUtils';

export const signUp = async (email: string, password: string, fullName: string, marketingOptIn: boolean = false) => {
  const redirectUrl = `${getCurrentUrl()}/`;
  
  console.log('Sign up attempt initiated with redirect:', redirectUrl);
  
  const { data, error } = await supabase.auth.signUp({
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
  
  // Check if Supabase explicitly says the email is already registered
  if (error) {
    console.error('Sign up error:', error);
    const msg = (error as any)?.message?.toLowerCase?.() ?? '';
    const code = (error as any)?.code ?? '';
    const isDuplicate = msg.includes('already registered') || code === 'user_already_registered';
    
    if (isDuplicate) {
      console.log('Duplicate email detected during sign up');
      return { error: null, isDuplicate: true };
    }
    
    return { error };
  }

  // Send welcome email after successful signup (only for new accounts)
  try {
    console.log('Sending welcome email to new user');
    
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
  
  return { error: null, isDuplicate: false };
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('🔐 Sign in attempt initiated');
    
    // Call the sign-in wrapper edge function for rate limiting
    const { data, error } = await supabase.functions.invoke('sign-in-wrapper', {
      body: { email, password }
    });

    if (error) {
      console.error('❌ Sign in error');
      return { error, accountDeleted: false };
    }

    // Check for rate limiting
    if (data?.isRateLimited) {
      console.log('🚫 Rate limit exceeded');
      return { 
        error: new Error(data.error || 'Too many failed sign-in attempts. Please try again later.'),
        accountDeleted: false
      };
    }

    // Check for authentication error
    if (data?.error) {
      console.error('❌ Authentication failed');
      return { 
        error: new Error(data.error),
        accountDeleted: false
      };
    }

    console.log('✅ Sign in successful');
    
    // Check if account has been soft-deleted
    if (data?.data?.user?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_deleted')
        .eq('id', data.data.user.id)
        .single();
      
      if (profile?.account_deleted) {
        console.log('❌ Account is soft-deleted');
        await supabase.auth.signOut();
        return { 
          error: new Error('This account has been deleted. Please contact support to restore your account.'),
          accountDeleted: true
        };
      }
    }

    console.log('✅ Account is active');
    return { error: null, accountDeleted: false };
  } catch (error) {
    console.error('💥 Sign in exception:', error);
    return { error, accountDeleted: false };
  }
};

export const signOut = async () => {
  console.log('Sign out initiated');
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      
      // Check if this is a stale session error (session already expired/doesn't exist)
      const isStaleSession = error.message?.includes('session_not_found') || 
                            error.message?.includes('Session not found') ||
                            error.status === 403;
      
      if (isStaleSession) {
        console.log('Stale session detected - treating as successful sign out');
        return { error: null, wasStaleSession: true };
      }
      
      return { error, wasStaleSession: false };
    }
    
    console.log('Sign out successful');
    return { error: null, wasStaleSession: false };
  } catch (err) {
    console.error('Sign out exception:', err);
    return { error: err, wasStaleSession: false };
  }
};

export const resetPassword = async (email: string) => {
  const redirectUrl = getRedirectUrl();
  
  console.log('Password reset request initiated');
  
  try {
    const response = await fetch(
      'https://amhznlnhrrugxatbeayo.supabase.co/functions/v1/password-reset-request',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaHpubG5ocnJ1Z3hhdGJlYXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDA2NDUsImV4cCI6MjA2NTY3NjY0NX0.36_2NRiObrLxWx_ngeNzMvOSzxcFpeGXh-xKoW4irkk'
        },
        body: JSON.stringify({ email, redirectUrl })
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle rate limiting specifically
      if (response.status === 429) {
        return { 
          error: { 
            message: data.error || 'Too many attempts. Please try again later.',
            status: 429,
            isRateLimited: true
          } 
        };
      }
      return { error: { message: data.error || 'Failed to send reset email' } };
    }
    
    return { error: null };
  } catch (err) {
    console.error('Password reset request failed:', err);
    return { error: { message: 'Network error. Please try again.' } };
  }
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

export const resendVerificationEmail = async (email: string) => {
  const redirectUrl = `${getCurrentUrl()}/`;
  
  console.log('Resending verification email with redirect:', redirectUrl);
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: redirectUrl
    }
  });
  
  if (error) {
    console.error('Resend verification error:', error);
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
    console.log('📡 Supabase project URL: https://amhznlnhrrugxatbeayo.supabase.co');
    console.log('🔑 Auth domain should match project URL');
    
    // Test if we can reach Supabase auth endpoint
    console.log('🌐 [STEP 3] Testing Supabase auth connectivity...');
    try {
      const response = await fetch('https://amhznlnhrrugxatbeayo.supabase.co/auth/v1/settings', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaHpubG5ocnJ1Z3hhdGJlYXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDA2NDUsImV4cCI6MjA2NTY3NjY0NX0.36_2NRiObrLxWx_ngeNzMvOSzxcFpeGXh-xKoW4irkk'
        }
      });
      console.log('🔗 Auth settings endpoint status:', response.status);
      if (response.status === 403) {
        console.error('🚨 403 FORBIDDEN: The API key might be invalid or the endpoint is restricted');
        const responseText = await response.text();
        console.error('🔍 Response body:', responseText);
      } else if (response.ok) {
        const settings = await response.json();
        console.log('✅ Auth settings retrieved successfully');
        console.log('🔍 External providers enabled:', settings.external);
      }
    } catch (fetchError) {
      console.error('🚨 Failed to reach Supabase auth endpoint:', fetchError);
    }
    
    console.log('📋 [STEP 4] OAuth call parameters:');
    console.log('   Provider: google');
    console.log('   Redirect URL:', `${getCurrentUrl()}/`);
    console.log('   Expected OAuth URL pattern: /auth/v1/authorize?provider=google...');
    
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
      
      return { error, accountDeleted: false };
    }

    console.log('✅ [STEP 4] Google OAuth initiated successfully');
    console.log('📊 OAuth response data:', data);
    console.log('🔄 [STEP 5] Browser should now redirect to Google...');
    console.log('🎯 Expected flow: Google login → consent → redirect to Supabase → redirect back to app');
    console.log('🔍 Note: After successful auth, check for profile creation in database');
    
    // Note: Account deletion check will happen in the auth state change handler
    // after the user is redirected back from Google
    return { error: null, accountDeleted: false };
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
    
    return { error: err, accountDeleted: false };
  }
};
