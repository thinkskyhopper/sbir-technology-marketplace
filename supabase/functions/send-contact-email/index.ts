
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import type { ContactEmailRequest } from './types.ts';
import { fetchAdminUsers } from './adminService.ts';
import { sendContactEmails } from './emailService.ts';
import { handleCorsRequest, handleSuccess, handleError } from './responseHandler.ts';
import { validateEnvironment, validateContactRequest } from './validationService.ts';

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return handleCorsRequest();
  }

  try {
    // Validate environment variables early
    validateEnvironment();

    const data: ContactEmailRequest = await req.json();
    console.log('📨 Contact email request received:', {
      name: data.name,
      email: data.email,
      listingId: data.listing.id,
      isGeneral: data.listing.id === "general-inquiry"
    });

    // Validate request data
    validateContactRequest(data);

    // Fetch admin users
    const adminEmails = await fetchAdminUsers();

    // Send emails to all admins
    const results = await sendContactEmails(data, adminEmails);
    
    // Check if at least one email was sent successfully
    const successful = results.filter(r => r.success);
    if (successful.length === 0) {
      throw new Error('Failed to send emails to any admin users');
    }

    return handleSuccess(results, adminEmails);
  } catch (error: any) {
    return handleError(error);
  }
};

serve(handler);
