
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
  interestLevel: string;
  experience: string;
  timeline: string;
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

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const emailResponse = await resend.emails.send({
      from: "SBIR Marketplace <onboarding@resend.dev>",
      to: ["bill@thinkskyhopper.com"],
      subject: `New SBIR Contract Inquiry - ${data.listing.title}`,
      html: `
        <h1>New SBIR Contract Inquiry</h1>
        
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>User Account:</strong> ${data.userEmail}</p>
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        
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
        
        ${data.message ? `
        <h2>Additional Message</h2>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        ` : ''}
        
        <hr>
        <p><em>This inquiry was submitted through the SBIR Marketplace platform.</em></p>
      `,
    });

    console.log("Contact email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
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
