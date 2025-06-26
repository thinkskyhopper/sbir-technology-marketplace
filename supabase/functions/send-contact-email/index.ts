
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactEmailRequest = await req.json();

    // Create Supabase client with service role key to access admin users
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Fetch all admin users
    const { data: adminProfiles, error: adminError } = await supabase
      .from('profiles')
      .select('email')
      .eq('role', 'admin');

    if (adminError) {
      console.error('Error fetching admin users:', adminError);
      throw new Error('Failed to fetch admin users');
    }

    if (!adminProfiles || adminProfiles.length === 0) {
      console.error('No admin users found');
      throw new Error('No admin users found');
    }

    const adminEmails = adminProfiles.map(profile => profile.email);
    console.log('Found admin users:', adminEmails.length, 'emails:', adminEmails);

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
      <h1>${isGenericContact ? 'New General Contact Inquiry' : 'New SBIR Contract Inquiry'}</h1>
      
      <h2>Contact Information</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>User Account:</strong> ${data.userEmail}</p>
      ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
    `;

    if (!isGenericContact) {
      emailContent += `
        <h2>Interest Details</h2>
        <p><strong>Interest Level:</strong> ${data.interestLevel}</p>
        <p><strong>SBIR Experience:</strong> ${data.experience}</p>
        <p><strong>Timeline:</strong> ${data.timeline}</p>
        
        <h2>Contract Details</h2>
        <p><strong>Title:</strong> ${data.listing.title}</p>
        <p><strong>Agency:</strong> ${data.listing.agency}</p>
        <p><strong>Phase:</strong> ${data.listing.phase}</p>
        <p><strong>Value:</strong> ${formatCurrency(data.listing.value)}</p>
        <p><strong>Contract ID:</strong> ${data.listing.id}</p>
      `;
    }

    if (data.message) {
      emailContent += `
        <h2>Additional Message</h2>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `;
    }

    emailContent += `
      <hr>
      <p><em>This inquiry was submitted through the SBIR Marketplace platform.</em></p>
    `;

    // Send individual emails to each admin to ensure delivery
    const emailPromises = adminEmails.map(async (adminEmail, index) => {
      console.log(`Sending email ${index + 1}/${adminEmails.length} to:`, adminEmail);
      
      try {
        const emailResponse = await resend.emails.send({
          from: "SBIR Marketplace <onboarding@resend.dev>",
          to: [adminEmail],
          subject: subject,
          html: emailContent,
        });
        
        console.log(`Email sent successfully to ${adminEmail}:`, emailResponse);
        return { success: true, email: adminEmail, response: emailResponse };
      } catch (error) {
        console.error(`Failed to send email to ${adminEmail}:`, error);
        return { success: false, email: adminEmail, error: error.message };
      }
    });

    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
    
    // Log results
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`Email sending complete: ${successful.length} successful, ${failed.length} failed`);
    
    if (failed.length > 0) {
      console.error('Failed emails:', failed);
    }

    // Return success if at least one email was sent successfully
    if (successful.length === 0) {
      throw new Error('Failed to send emails to any admin users');
    }

    return new Response(JSON.stringify({
      success: true,
      emailsSent: successful.length,
      totalAdmins: adminEmails.length,
      results: results
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
