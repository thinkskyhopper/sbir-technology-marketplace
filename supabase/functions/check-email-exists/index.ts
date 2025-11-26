import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5 requests
const RATE_LIMIT_WINDOW = 60000; // per minute

// Security: Constant delay prevents timing attacks that could be used to enumerate registered emails
// All responses take at least this long, regardless of whether email exists or not

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

interface CheckEmailRequest {
  email: string;
}

// Constant delay to prevent timing attacks
const RESPONSE_DELAY_MS = 200;

const handler = async (req: Request): Promise<Response> => {
  const startTime = Date.now();
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: CheckEmailRequest = await req.json();

    // Validate email using shared utility
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      await ensureMinimumDelay(startTime);
      return new Response(
        JSON.stringify({ error: emailValidation.error || "Invalid email provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Rate limiting based on IP or email
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `${clientIp}:${email}`;

    if (!checkRateLimit(rateLimitKey)) {
      await ensureMinimumDelay(startTime);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if email exists in auth.users
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Error checking email:", error);
      await ensureMinimumDelay(startTime);
      return new Response(
        JSON.stringify({ error: "Failed to check email" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Find user with matching email
    const matchingUser = users.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    );

    // If user exists in auth, also check if they have an active profile
    let emailExists = false;
    if (matchingUser) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, account_deleted')
        .eq('id', matchingUser.id)
        .single();

      // Only consider email as existing if:
      // 1. User exists in auth.users AND
      // 2. Has a profile AND
      // 3. Profile is not deleted
      emailExists = !profileError && profile && !profile.account_deleted;
      
      console.log(`Email check for ${email}: auth user exists=${!!matchingUser}, has profile=${!!profile}, is deleted=${profile?.account_deleted}, final result=${emailExists}`);
    }

    // Ensure constant time response to prevent timing attacks
    await ensureMinimumDelay(startTime);
    
    return new Response(
      JSON.stringify({ exists: emailExists }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in check-email-exists function:", error);
    await ensureMinimumDelay(startTime);
    return new Response(
      JSON.stringify({ error: "Unable to check email availability. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Helper function to ensure consistent response timing
async function ensureMinimumDelay(startTime: number): Promise<void> {
  const elapsed = Date.now() - startTime;
  const remaining = RESPONSE_DELAY_MS - elapsed;
  if (remaining > 0) {
    await new Promise(resolve => setTimeout(resolve, remaining));
  }
}

serve(handler);
