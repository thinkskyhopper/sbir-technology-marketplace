
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationRequest {
  listing: {
    id: string;
    title: string;
    agency: string;
    value: number;
    phase: string;
    category: string;
    description: string;
  };
  submitterName: string;
  submitterEmail: string;
}

// Helper function to add delay between email sends
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔔 Admin notification request received');
    const data: AdminNotificationRequest = await req.json();
    console.log('📋 Request data:', {
      listingId: data.listing.id,
      listingTitle: data.listing.title,
      submitterEmail: data.submitterEmail
    });

    // Validate required environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      console.error('❌ Missing required environment variables');
      throw new Error('Missing required environment variables');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('👥 Fetching admin users...');
    // Get all admin users
    const { data: adminProfiles, error: adminError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('role', 'admin')
      .order('email'); // Add consistent ordering

    if (adminError) {
      console.error('❌ Error fetching admin profiles:', adminError);
      throw new Error(`Failed to fetch admin profiles: ${adminError.message}`);
    }

    if (!adminProfiles || adminProfiles.length === 0) {
      console.log('⚠️ No admin users found');
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No admin users to notify',
        emailsSent: 0,
        totalAdmins: 0
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    console.log(`👥 Found ${adminProfiles.length} admin users:`, adminProfiles.map(p => p.email));

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const adminEmails = adminProfiles.map(profile => profile.email).filter(email => email); // Filter out null/undefined emails

    console.log('📧 Validated admin emails:', adminEmails);

    // Send emails sequentially with delays to avoid rate limiting
    const results = [];
    
    for (let i = 0; i < adminEmails.length; i++) {
      const adminEmail = adminEmails[i];
      console.log(`📤 Sending admin notification ${i + 1}/${adminEmails.length} to:`, adminEmail);
      
      try {
        const emailResponse = await resend.emails.send({
          from: "SBIR Marketplace <noreply@updates.thesbirtechmarketplace.com>",
          to: [adminEmail],
          subject: `New SBIR Listing Pending Approval - ${data.listing.title}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New SBIR Listing Requires Approval</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">New SBIR Listing Requires Approval</h1>
              </div>
              
              <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 25px;">A new SBIR contract listing has been submitted and is pending your approval.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                  <h2 style="color: #667eea; margin-top: 0;">Listing Details</h2>
                  <p><strong>Title:</strong> ${data.listing.title}</p>
                  <p><strong>Agency:</strong> ${data.listing.agency}</p>
                  <p><strong>Phase:</strong> ${data.listing.phase}</p>
                  <p><strong>Category:</strong> ${data.listing.category}</p>
                  <p><strong>Value:</strong> ${formatCurrency(data.listing.value)}</p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
                  <h2 style="color: #28a745; margin-top: 0;">Description</h2>
                  <p style="white-space: pre-wrap;">${data.listing.description}</p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
                  <h2 style="color: #e68900; margin-top: 0;">Submitted By</h2>
                  <p><strong>Name:</strong> ${data.submitterName}</p>
                  <p><strong>Email:</strong> ${data.submitterEmail}</p>
                </div>
                
                <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                  <h2 style="color: #1976d2; margin-top: 0;">Action Required</h2>
                  <p style="margin-bottom: 15px;">Please log into the admin panel to review and approve or reject this listing.</p>
                  <p style="font-family: monospace; background: white; padding: 10px; border-radius: 4px; display: inline-block;"><strong>Listing ID:</strong> ${data.listing.id}</p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
                <p style="text-align: center; color: #6c757d; font-size: 14px;">
                  <em>This notification was sent automatically from the SBIR Marketplace platform.<br>
                  If you believe this email was sent in error, please contact support.</em>
                </p>
              </div>
            </body>
            </html>
          `,
          // Add email headers to improve deliverability
          headers: {
            'List-Unsubscribe': '<mailto:unsubscribe@thesbirtechmarketplace.com>',
            'X-Entity-ID': `sbir-listing-${data.listing.id}`,
            'X-Priority': '2',
            'Importance': 'high'
          }
        });

        console.log(`✅ Admin notification sent successfully to ${adminEmail}:`, emailResponse);
        results.push({ success: true, email: adminEmail, response: emailResponse });
      } catch (error) {
        console.error(`❌ Failed to send admin notification to ${adminEmail}:`, error);
        results.push({ success: false, email: adminEmail, error: error.message });
        
        // If it's a rate limit error, wait longer before the next attempt
        if (error.message && error.message.includes('rate_limit_exceeded')) {
          console.log('Rate limit detected, waiting 2 seconds before next email...');
          await delay(2000);
        }
      }
      
      // Add a delay between each email to prevent rate limiting
      // Skip delay for the last email
      if (i < adminEmails.length - 1) {
        await delay(800); // Increased delay to 800ms for better deliverability
      }
    }
    
    // Log results
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`📊 Admin notification complete: ${successful.length} successful, ${failed.length} failed`);
    
    if (failed.length > 0) {
      console.error('❌ Failed admin notifications:', failed);
    }

    // Return success if at least one email was sent successfully
    if (successful.length === 0) {
      throw new Error('Failed to send admin notifications to any admin users');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      emailsSent: successful.length,
      totalAdmins: adminEmails.length,
      results: results,
      adminEmails: adminEmails // Include for debugging
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error in send-admin-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        emailsSent: 0
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
