
import type { EmailResult } from './types.ts';

export const handleCorsRequest = (): Response => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
};

export const handleSuccess = (results: EmailResult[], emails: string[]): Response => {
  const successful = results.filter(r => r.success);
  console.log(`✅ Change request status notification complete: ${successful.length}/${emails.length} emails sent successfully`);
  
  return new Response(
    JSON.stringify({
      success: true,
      message: `Status notification sent successfully to ${successful.length}/${emails.length} recipients`,
      results: results
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};

export const handleError = (error: any): Response => {
  console.error('❌ Change request status notification error:', error);
  
  return new Response(
    JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred',
      details: error.stack || 'No stack trace available'
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};
