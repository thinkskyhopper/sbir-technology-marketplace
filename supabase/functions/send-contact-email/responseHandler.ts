
import type { EmailResult } from './types.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export const handleCorsRequest = (): Response => {
  return new Response(null, { headers: corsHeaders });
};

export const handleSuccess = (results: EmailResult[], adminEmails: string[]): Response => {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`📊 Contact email sending complete: ${successful.length} successful, ${failed.length} failed`);
  
  if (failed.length > 0) {
    console.error('❌ Failed contact emails:', failed);
  }

  return new Response(JSON.stringify({
    success: true,
    emailsSent: successful.length,
    totalAdmins: adminEmails.length,
    results: results,
    adminEmails: adminEmails
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
};

export const handleError = (error: any): Response => {
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
};
