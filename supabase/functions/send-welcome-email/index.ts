
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
    
    // Extract first name from full_name or use email prefix as fallback
    const firstName = full_name ? full_name.split(' ')[0] : email.split('@')[0]
    
    const emailHtml = createWelcomeEmailHtml(firstName, email)
    
    const { error: emailError } = await resend.emails.send({
      from: 'The SBIR Tech Marketplace <noreply@updates.thesbirtechmarketplace.com>',
      to: [email],
      subject: 'Welcome to The SBIR Tech Marketplace!',
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

function escapeHtml(text: string): string {
  if (!text) return '';
  
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}

function createWelcomeEmailHtml(firstName: string, email: string): string {
  const safeFirstName = escapeHtml(firstName);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to The SBIR Tech Marketplace</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8fafc; padding: 40px; border-radius: 10px; text-align: center;">
        <h1 style="color: #1f2937; margin-bottom: 30px; font-size: 28px;">Welcome to The SBIR Tech Marketplace!</h1>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; margin: 30px 0; border: 1px solid #e5e7eb; text-align: left;">
          <p style="font-size: 16px; margin-bottom: 20px; color: #4b5563; line-height: 1.7;">
            Hello ${safeFirstName},
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px; color: #4b5563; line-height: 1.7;">
            Thank you for signing up for The SBIR Tech Marketplace! We're thrilled to have you join our community where we connect innovators to buy and sell SBIR-developed technologies.
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px; color: #4b5563; line-height: 1.7;">
            Our platform is designed to help small businesses and entrepreneurs like you bring SBIR innovations to the forefront through seamless B2B transactions. Whether you're looking to acquire cutting-edge tech or find a buyer for your own, we're here to make it happen.
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px; color: #4b5563; line-height: 1.7;">
            You'll receive regular updates on new listings, opportunities, and resources to support your success. If you have any questions, our team is just a message away.
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px; color: #4b5563; line-height: 1.7;">
            Welcome aboard—we're excited to see what you'll achieve!
          </p>
          
          <p style="font-size: 16px; margin-bottom: 0; color: #4b5563; line-height: 1.7;">
            All the best,<br>
            <strong>Ted</strong>
          </p>
        </div>
        
        <div style="margin: 30px 0;">
          <a href="https://thesbirtechmarketplace.com" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
            Start Exploring
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 30px; margin-top: 40px; font-size: 14px; color: #6b7280;">
          <p style="margin-bottom: 20px;">
            You can update your email preferences anytime in your <a href="https://thesbirtechmarketplace.com/settings" style="color: #3b82f6;">account settings</a>.
          </p>
          
          <p style="margin-top: 30px;">
            <strong>The SBIR Tech Marketplace Team</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
