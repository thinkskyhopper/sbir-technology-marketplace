
import type { EmailResult } from './types.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export const handleCorsRequest = (): Response => {
  return new Response(null, { headers: corsHeaders });
};

export const handleNoAdminsFound = (): Response => {
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
};

export const handleSuccess = (results: EmailResult[], adminEmails: string[]): Response => {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`📊 Admin notification complete: ${successful.length} successful, ${failed.length} failed`);
  
  if (failed.length > 0) {
    console.error('❌ Failed admin notifications:', failed);
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
};
