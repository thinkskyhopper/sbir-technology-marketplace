
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import type { AdminNotificationRequest } from './types.ts';
import { fetchAdminUsers } from './adminService.ts';
import { sendAdminNotificationEmails } from './emailService.ts';
import { handleCorsRequest, handleNoAdminsFound, handleSuccess, handleError } from './responseHandler.ts';

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleCorsRequest();
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
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('❌ Missing RESEND_API_KEY environment variable');
      throw new Error('Missing required environment variables');
    }

    // Fetch admin users
    const adminEmails = await fetchAdminUsers();
    
    if (adminEmails.length === 0) {
      return handleNoAdminsFound();
    }

    // Send emails to all admins
    const results = await sendAdminNotificationEmails(data, adminEmails);
    
    // Check if at least one email was sent successfully
    const successful = results.filter(r => r.success);
    if (successful.length === 0) {
      throw new Error('Failed to send admin notifications to any admin users');
    }

    return handleSuccess(results, adminEmails);
  } catch (error: any) {
    return handleError(error);
  }
};

serve(handler);
