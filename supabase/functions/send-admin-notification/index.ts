
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: AdminNotificationRequest = await req.json();

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

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    // Send email to all admins
    const adminEmails = adminProfiles.map(profile => profile.email);

    const emailResponse = await resend.emails.send({
      from: "SBIR Marketplace <onboarding@resend.dev>",
      to: adminEmails,
      subject: `New SBIR Listing Pending Approval - ${data.listing.title}`,
      html: `
        <h1>New SBIR Listing Requires Approval</h1>
        
        <p>A new SBIR contract listing has been submitted and is pending your approval.</p>
        
        <h2>Listing Details</h2>
        <p><strong>Title:</strong> ${data.listing.title}</p>
        <p><strong>Agency:</strong> ${data.listing.agency}</p>
        <p><strong>Phase:</strong> ${data.listing.phase}</p>
        <p><strong>Category:</strong> ${data.listing.category}</p>
        <p><strong>Value:</strong> ${formatCurrency(data.listing.value)}</p>
        
        <h2>Description</h2>
        <p>${data.listing.description.replace(/\n/g, '<br>')}</p>
        
        <h2>Submitted By</h2>
        <p><strong>Name:</strong> ${data.submitterName}</p>
        <p><strong>Email:</strong> ${data.submitterEmail}</p>
        
        <h2>Action Required</h2>
        <p>Please log into the admin panel to review and approve or reject this listing.</p>
        <p><strong>Listing ID:</strong> ${data.listing.id}</p>
        
        <hr>
        <p><em>This notification was sent automatically from the SBIR Marketplace platform.</em></p>
      `,
    });

    console.log("Admin notification email sent successfully:", emailResponse);

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
    console.error("Error in send-admin-notification function:", error);
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
