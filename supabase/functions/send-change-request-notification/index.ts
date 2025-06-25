
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ChangeRequestNotificationRequest {
  changeRequest: {
    id: string;
    listing_id: string;
    request_type: 'change' | 'deletion';
    requested_changes?: any;
    reason?: string;
    sbir_listings?: {
      title: string;
      agency: string;
    };
  };
  submitterName: string;
  submitterEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ChangeRequestNotificationRequest = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all admin users
    const { data: adminProfiles, error: adminError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('role', 'admin');

    if (adminError) {
      console.error('Error fetching admin profiles:', adminError);
      throw new Error('Failed to fetch admin profiles');
    }

    if (!adminProfiles || adminProfiles.length === 0) {
      console.log('No admin users found');
      return new Response(JSON.stringify({ message: 'No admin users to notify' }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    const requestType = data.changeRequest.request_type;
    const listingTitle = data.changeRequest.sbir_listings?.title || 'Unknown Listing';
    const listingAgency = data.changeRequest.sbir_listings?.agency || 'Unknown Agency';

    // Send email to all admins
    const adminEmails = adminProfiles.map(profile => profile.email);

    let emailSubject = `New ${requestType === 'change' ? 'Change' : 'Deletion'} Request - ${listingTitle}`;
    let emailContent = `
      <h1>New Listing ${requestType === 'change' ? 'Change' : 'Deletion'} Request</h1>
      
      <p>A ${requestType === 'change' ? 'change' : 'deletion'} request has been submitted for a listing and requires admin review.</p>
      
      <h2>Listing Details</h2>
      <p><strong>Title:</strong> ${listingTitle}</p>
      <p><strong>Agency:</strong> ${listingAgency}</p>
      <p><strong>Request Type:</strong> ${requestType === 'change' ? 'Change Request' : 'Deletion Request'}</p>
      
      <h2>Submitted By</h2>
      <p><strong>Name:</strong> ${data.submitterName}</p>
      <p><strong>Email:</strong> ${data.submitterEmail}</p>
      
      <h2>Reason</h2>
      <p>${data.changeRequest.reason || 'No reason provided'}</p>
    `;

    if (requestType === 'change' && data.changeRequest.requested_changes) {
      emailContent += `
        <h2>Requested Changes</h2>
        <ul>
          ${Object.entries(data.changeRequest.requested_changes).map(([key, value]) => 
            `<li><strong>${key}:</strong> ${value}</li>`
          ).join('')}
        </ul>
      `;
    }

    emailContent += `
      <h2>Action Required</h2>
      <p>Please log into the admin panel to review and approve or reject this ${requestType} request.</p>
      <p><strong>Request ID:</strong> ${data.changeRequest.id}</p>
      
      <hr>
      <p><em>This notification was sent automatically from the SBIR Marketplace platform.</em></p>
    `;

    const emailResponse = await resend.emails.send({
      from: "SBIR Marketplace <onboarding@resend.dev>",
      to: adminEmails,
      subject: emailSubject,
      html: emailContent,
    });

    console.log("Change request notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailsSent: adminEmails.length,
      emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-change-request-notification function:", error);
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
