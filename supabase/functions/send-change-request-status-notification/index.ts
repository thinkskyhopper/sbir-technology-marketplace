
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import type { ChangeRequestStatusNotificationRequest } from './types.ts';
import { sendChangeRequestStatusEmail } from './emailService.ts';
import { handleCorsRequest, handleSuccess, handleError } from './responseHandler.ts';

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleCorsRequest();
  }

  try {
    console.log('📧 Change request status notification request received');
    const data: ChangeRequestStatusNotificationRequest = await req.json();
    console.log('📋 Request data:', {
      requestId: data.changeRequest.id,
      status: data.changeRequest.status,
      userEmail: data.userEmail
    });

    // Validate required environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('❌ Missing RESEND_API_KEY environment variable');
      throw new Error('Missing required environment variables');
    }

    // Send email to the user
    const result = await sendChangeRequestStatusEmail(data);
    
    if (!result.success) {
      throw new Error(`Failed to send status notification: ${result.error}`);
    }

    return handleSuccess([result], [data.userEmail]);
  } catch (error: any) {
    return handleError(error);
  }
};

serve(handler);
