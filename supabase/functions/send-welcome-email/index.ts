
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { Resend } from 'npm:resend@4.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WelcomeEmailRequest {
  email: string
  full_name?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Welcome email function called');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not found in environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const resend = new Resend(resendApiKey)
    
    const { email, full_name }: WelcomeEmailRequest = await req.json()
    
    if (!email) {
      throw new Error('Email is required');
    }
    
    console.log('Sending welcome email to:', email);
    
    const userName = full_name || email.split('@')[0]
    
    const emailHtml = createWelcomeEmailHtml(userName, email)
    
    const { error: emailError } = await resend.emails.send({
      from: 'SBIR Listings <notifications@yourdomain.com>',
      to: [email],
      subject: 'Welcome to SBIR Listings!',
      html: emailHtml,
    })
    
    if (emailError) {
      console.error('Failed to send welcome email:', emailError);
      throw emailError;
    }
    
    console.log('Welcome email sent successfully to:', email);
    
    return new Response(
      JSON.stringify({ message: 'Welcome email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Welcome email function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function createWelcomeEmailHtml(userName: string, email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to SBIR Listings</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8fafc; padding: 40px; border-radius: 10px; text-align: center;">
        <h1 style="color: #1f2937; margin-bottom: 20px; font-size: 28px;">Welcome to SBIR Listings!</h1>
        
        <p style="font-size: 18px; margin-bottom: 30px; color: #4b5563;">
          Hello ${userName},
        </p>
        
        <p style="font-size: 16px; margin-bottom: 25px; color: #4b5563;">
          Welcome to the SBIR marketplace! We're excited to have you join our community of innovators, researchers, and technology enthusiasts.
        </p>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; margin: 30px 0; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 20px;">What you can do now:</h2>
          
          <div style="text-align: left; margin-bottom: 20px;">
            <p style="margin-bottom: 15px; color: #4b5563;">
              🔍 <strong>Browse SBIR Listings:</strong> Explore thousands of SBIR technology opportunities
            </p>
            <p style="margin-bottom: 15px; color: #4b5563;">
              💾 <strong>Bookmark Favorites:</strong> Save interesting listings for later review
            </p>
            <p style="margin-bottom: 15px; color: #4b5563;">
              📝 <strong>Submit Your Own:</strong> Share your SBIR technologies with the community
            </p>
            <p style="margin-bottom: 15px; color: #4b5563;">
              🔔 <strong>Get Notifications:</strong> Set up alerts for new listings in your areas of interest
            </p>
            <p style="margin-bottom: 15px; color: #4b5563;">
              👥 <strong>Connect with Experts:</strong> Access our network of experienced professionals
            </p>
          </div>
        </div>
        
        <div style="margin: 30px 0;">
          <a href="https://yourdomain.com" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
            Start Exploring
          </a>
        </div>
        
        <div style="margin: 30px 0;">
          <a href="https://yourdomain.com/settings" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 25px; text-decoration: none; border-radius: 6px; font-size: 14px; margin-right: 10px;">
            Update Profile
          </a>
          <a href="https://yourdomain.com/settings" style="display: inline-block; background-color: #8b5cf6; color: white; padding: 10px 25px; text-decoration: none; border-radius: 6px; font-size: 14px;">
            Set Notifications
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 40px; font-size: 14px; color: #6b7280;">
          <p style="margin-bottom: 15px;">
            <strong>Need help getting started?</strong><br>
            Check out our <a href="https://yourdomain.com/team" style="color: #3b82f6;">team page</a> or contact our support team.
          </p>
          
          <p style="margin-bottom: 20px;">
            You can update your email preferences anytime in your <a href="https://yourdomain.com/settings" style="color: #3b82f6;">account settings</a>.
          </p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>The SBIR Listings Team</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
