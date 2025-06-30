
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders, handleCors } from './responseHandler.ts';
import { sendCSVUploadNotificationEmails } from './emailService.ts';
import { fetchAdminUsers } from './adminService.ts';
import type { CSVUploadNotificationRequest } from './types.ts';

const handler = async (req: Request): Promise<Response> => {
  console.log('🔔 CSV Upload Notification function called');
  
  if (req.method === 'OPTIONS') {
    return handleCors();
  }

  try {
    const { uploadDetails }: CSVUploadNotificationRequest = await req.json();
    
    console.log('📋 Processing CSV upload notification:', {
      fileName: uploadDetails.fileName,
      listingCount: uploadDetails.listingCount,
      uploadedBy: uploadDetails.uploadedBy
    });

    // Validate required fields
    if (!uploadDetails.fileName || !uploadDetails.listingCount || !uploadDetails.uploadedBy) {
      console.error('❌ Missing required upload details');
      return new Response(
        JSON.stringify({ 
          error: 'Missing required upload details',
          details: 'fileName, listingCount, and uploadedBy are required'
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log('👥 Fetching admin users for notification...');
    const adminEmails = await fetchAdminUsers();
    
    if (adminEmails.length === 0) {
      console.log('⚠️ No admin users found to notify');
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'No admin users found to notify',
          adminEmailCount: 0,
          results: []
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log('📧 Sending CSV upload notification emails...');
    const emailResults = await sendCSVUploadNotificationEmails(uploadDetails, adminEmails);
    
    const successfulEmails = emailResults.filter(result => result.success).length;
    const failedEmails = emailResults.filter(result => !result.success).length;
    
    console.log(`✅ CSV upload notification process completed:`, {
      totalAdmins: adminEmails.length,
      successfulEmails,
      failedEmails
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'CSV upload notifications processed',
        adminEmailCount: adminEmails.length,
        successfulEmails,
        failedEmails,
        results: emailResults
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
    
  } catch (error) {
    console.error('❌ CSV upload notification function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);
