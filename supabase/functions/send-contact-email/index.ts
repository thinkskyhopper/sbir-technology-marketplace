
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  company: string;
  interestLevel?: string;
  experience?: string;
  timeline?: string;
  message: string;
  listing: {
    id: string;
    title: string;
    agency: string;
    value: number;
    phase: string;
  };
  userEmail: string;
}

// Helper function to add delay between email sends
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactEmailRequest = await req.json();
    console.log('📨 Contact email request received:', {
      name: data.name,
      email: data.email,
      listingId: data.listing.id,
      isGeneral: data.listing.id === "general-inquiry"
    });

    // Create Supabase client with service role key to access admin users
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Fetch all admin users
    const { data: adminProfiles, error: adminError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('role', 'admin')
      .order('email'); // Add consistent ordering

    if (adminError) {
      console.error('Error fetching admin users:', adminError);
      throw new Error('Failed to fetch admin users');
    }

    if (!adminProfiles || adminProfiles.length === 0) {
      console.error('No admin users found');
      throw new Error('No admin users found');
    }

    const adminEmails = adminProfiles.map(profile => profile.email).filter(email => email); // Filter out null/undefined emails
    console.log('📧 Found admin users:', adminProfiles.length, 'validated emails:', adminEmails);

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    // Determine if this is a generic contact form or SBIR-specific
    const isGenericContact = data.listing.id === "general-inquiry";
    
    const subject = isGenericContact 
      ? `New General Contact Inquiry from ${data.name}`
      : `New SBIR Contract Inquiry - ${data.listing.title}`;

    let emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isGenericContact ? 'New General Contact Inquiry' : 'New SBIR Contract Inquiry'}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">${isGenericContact ? 'New General Contact Inquiry' : 'New SBIR Contract Inquiry'}</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
            <h2 style="color: #28a745; margin-top: 0;">Contact Information</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>User Account:</strong> ${data.userEmail}</p>
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
          </div>
    `;

    if (!isGenericContact) {
      emailContent += `
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; margin: 20px 0;">
          <h2 style="color: #007bff; margin-top: 0;">Interest Details</h2>
          <p><strong>Interest Level:</strong> ${data.interestLevel}</p>
          <p><strong>SBIR Experience:</strong> ${data.experience}</p>
          <p><strong>Timeline:</strong> ${data.timeline}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #6f42c1; margin: 20px 0;">
          <h2 style="color: #6f42c1; margin-top: 0;">Contract Details</h2>
          <p><strong>Title:</strong> ${data.listing.title}</p>
          <p><strong>Agency:</strong> ${data.listing.agency}</p>
          <p><strong>Phase:</strong> ${data.listing.phase}</p>
          <p><strong>Value:</strong> ${formatCurrency(data.listing.value)}</p>
          <p style="font-family: monospace; background: #f8f9fa; padding: 10px; border-radius: 4px;"><strong>Contract ID:</strong> ${data.listing.id}</p>
        </div>
      `;
    }

    if (data.message) {
      emailContent += `
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <h2 style="color: #e68900; margin-top: 0;">Additional Message</h2>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
      `;
    }

    emailContent += `
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          <p style="text-align: center; color: #6c757d; font-size: 14px;">
            <em>This inquiry was submitted through the SBIR Marketplace platform.<br>
            If you believe this email was sent in error, please contact support.</em>
          </p>
        </div>
      </body>
      </html>
    `;

    // Send emails sequentially with delays to avoid rate limiting
    const results = [];
    
    for (let i = 0; i < adminEmails.length; i++) {
      const adminEmail = adminEmails[i];
      console.log(`📤 Sending contact email ${i + 1}/${adminEmails.length} to:`, adminEmail);
      
      try {
        const emailResponse = await resend.emails.send({
          from: "SBIR Marketplace <noreply@updates.thesbirtechmarketplace.com>",
          to: [adminEmail],
          subject: subject,
          html: emailContent,
          // Add email headers to improve deliverability
          headers: {
            'List-Unsubscribe': '<mailto:unsubscribe@thesbirtechmarketplace.com>',
            'X-Entity-ID': `contact-inquiry-${Date.now()}`,
            'X-Priority': '3',
            'Reply-To': data.email
          }
        });
        
        console.log(`✅ Contact email sent successfully to ${adminEmail}:`, emailResponse);
        results.push({ success: true, email: adminEmail, response: emailResponse });
      } catch (error) {
        console.error(`❌ Failed to send contact email to ${adminEmail}:`, error);
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
    
    console.log(`📊 Contact email sending complete: ${successful.length} successful, ${failed.length} failed`);
    
    if (failed.length > 0) {
      console.error('❌ Failed contact emails:', failed);
    }

    // Return success if at least one email was sent successfully
    if (successful.length === 0) {
      throw new Error('Failed to send emails to any admin users');
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
    console.error("❌ Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
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
