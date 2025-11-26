import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limit configuration
const MAX_ATTEMPTS = 3;
const WINDOW_MINUTES = 15;
const ACTION_TYPE = 'password_reset';

interface PasswordResetRequest {
  email: string;
  redirectUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectUrl }: PasswordResetRequest = await req.json();
    
    // Validate email
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Check rate limit - count recent attempts for this email
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    
    const { count, error: countError } = await supabaseAdmin
      .from('rate_limit_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('action_type', ACTION_TYPE)
      .eq('identifier', normalizedEmail)
      .gte('attempted_at', windowStart);

    if (countError) {
      console.error('Error checking rate limit:', countError);
      // Fail open but log the error - don't block users if rate limit check fails
    }

    const attemptCount = count || 0;
    
    if (attemptCount >= MAX_ATTEMPTS) {
      console.log(`Rate limit exceeded for email: ${attemptCount} attempts in ${WINDOW_MINUTES} minutes`);
      
      return new Response(
        JSON.stringify({ 
          error: "Too many password reset attempts. Please try again later.",
          retryAfter: WINDOW_MINUTES * 60
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Retry-After": String(WINDOW_MINUTES * 60)
          } 
        }
      );
    }

    // Record this attempt
    const { error: insertError } = await supabaseAdmin
      .from('rate_limit_attempts')
      .insert({
        action_type: ACTION_TYPE,
        identifier: normalizedEmail,
        ip_address: clientIp
      });

    if (insertError) {
      console.error('Error recording rate limit attempt:', insertError);
      // Continue anyway - don't block the user
    }

    // Perform the actual password reset
    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(
      normalizedEmail,
      { redirectTo: redirectUrl }
    );

    if (resetError) {
      console.error('Password reset error:', resetError);
      // Don't expose whether the email exists - always return success-like message
      // This prevents email enumeration attacks
    }

    // Always return success to prevent email enumeration
    console.log(`Password reset requested (attempt ${attemptCount + 1}/${MAX_ATTEMPTS})`);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "If an account exists with this email, a password reset link has been sent."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error('Error in password-reset-request:', error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
