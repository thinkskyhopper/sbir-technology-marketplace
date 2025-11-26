import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATE_LIMIT_ATTEMPTS = 5;
const LOCKOUT_ATTEMPTS = 10;
const WINDOW_MINUTES = 15;
const LOCKOUT_DURATION_MINUTES = 60;
const ACTION_TYPE = 'sign_in_failed';

interface SignInRequest {
  email: string;
  password: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password }: SignInRequest = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Check if account is locked
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('account_locked, account_locked_until, lock_reason')
      .eq('email', email.toLowerCase())
      .single();

    if (profile?.account_locked) {
      const lockedUntil = profile.account_locked_until ? new Date(profile.account_locked_until) : null;
      
      // Check if lockout has expired
      if (lockedUntil && lockedUntil > new Date()) {
        console.log(`Account locked for email: ${email}`);
        return new Response(
          JSON.stringify({ 
            error: 'Your account has been temporarily locked due to too many failed sign-in attempts. Please try again later or reset your password to unlock immediately.',
            isLocked: true,
            lockedUntil: profile.account_locked_until,
            lockReason: profile.lock_reason
          }),
          { 
            status: 423, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } else if (lockedUntil) {
        // Lockout expired - auto-unlock
        console.log(`Auto-unlocking expired lockout for email: ${email}`);
        await supabaseAdmin.rpc('unlock_user_account', { 
          user_id_param: profile.id 
        });
      }
    }

    // Check rate limiting for failed sign-in attempts
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    
    const { data: recentAttempts, error: attemptError } = await supabaseAdmin
      .from('rate_limit_attempts')
      .select('*')
      .eq('action_type', ACTION_TYPE)
      .eq('identifier', email.toLowerCase())
      .gte('attempted_at', windowStart);

    if (attemptError) {
      console.error('Error checking rate limit:', attemptError);
    }

    // Check if rate limit exceeded
    if (recentAttempts && recentAttempts.length >= RATE_LIMIT_ATTEMPTS) {
      console.log(`Rate limit exceeded for email: ${email}`);
      return new Response(
        JSON.stringify({ 
          error: 'Too many failed sign-in attempts. Please try again in 15 minutes.',
          isRateLimited: true
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a regular client for sign-in (not admin client)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Attempt sign-in
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    // If sign-in failed, record the attempt
    if (error) {
      console.log(`Failed sign-in attempt for email: ${email}`);
      
      // Record failed attempt
      const { error: recordError } = await supabaseAdmin
        .from('rate_limit_attempts')
        .insert({
          action_type: ACTION_TYPE,
          identifier: email.toLowerCase(),
          ip_address: req.headers.get('x-forwarded-for') || 'unknown'
        });

      if (recordError) {
        console.error('Error recording failed attempt:', recordError);
      }

      // Check if we should lock the account (10+ attempts)
      const { data: allAttempts } = await supabaseAdmin
        .from('rate_limit_attempts')
        .select('*')
        .eq('action_type', ACTION_TYPE)
        .eq('identifier', email.toLowerCase())
        .gte('attempted_at', windowStart);

      if (allAttempts && allAttempts.length >= LOCKOUT_ATTEMPTS) {
        // Lock the account
        const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
        
        await supabaseAdmin
          .from('profiles')
          .update({
            account_locked: true,
            account_locked_at: new Date().toISOString(),
            account_locked_until: lockUntil.toISOString(),
            lock_reason: 'Too many failed sign-in attempts'
          })
          .eq('email', email.toLowerCase());

        console.log(`Account locked for email: ${email} until ${lockUntil.toISOString()}`);

        return new Response(
          JSON.stringify({ 
            error: 'Your account has been locked due to too many failed sign-in attempts. Please reset your password to unlock or wait 1 hour.',
            isLocked: true,
            lockedUntil: lockUntil.toISOString()
          }),
          { 
            status: 423, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Sign-in successful - clear rate limit attempts
    await supabaseAdmin
      .from('rate_limit_attempts')
      .delete()
      .eq('action_type', ACTION_TYPE)
      .eq('identifier', email.toLowerCase());

    console.log(`Successful sign-in for email: ${email}`);
    return new Response(
      JSON.stringify({ data }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in sign-in-wrapper function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
