import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from 'npm:resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BreachNotificationRequest {
  subject: string;
  message: string;
  incident_date: string;
  affected_data_types: string[];
  steps_taken: string;
  user_actions_required: string;
  contact_info: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get the authorization header and verify admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const requestBody: BreachNotificationRequest = await req.json();

    // Get all users with email notifications enabled
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('email, full_name, first_name')
      .eq('account_deleted', false)
      .eq('email_notifications_enabled', true);

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users found with email notifications enabled' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send breach notification emails
    const emailPromises = users.map(async (userProfile) => {
      const firstName = userProfile.first_name || userProfile.full_name?.split(' ')[0] || 'User';
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Important Security Notice</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
            <h1 style="color: #dc3545; margin-top: 0;">Important Security Notice</h1>
            
            <p>Dear ${firstName},</p>
            
            <p>We are writing to inform you of a security incident that may have affected your personal information in our SBIR marketplace system.</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Incident Details</h3>
              <p><strong>Date of Incident:</strong> ${new Date(requestBody.incident_date).toLocaleDateString()}</p>
              <p><strong>Affected Data Types:</strong> ${requestBody.affected_data_types.join(', ')}</p>
            </div>
            
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">What We're Doing</h3>
              <p>${requestBody.steps_taken}</p>
            </div>
            
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">What You Should Do</h3>
              <p>${requestBody.user_actions_required}</p>
            </div>
            
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Contact Information</h3>
              <p>If you have any questions or concerns, please contact us:</p>
              <p>${requestBody.contact_info}</p>
            </div>
            
            <p style="margin-top: 30px;">We sincerely apologize for this incident and any inconvenience it may cause. We take the security of your personal information very seriously and are committed to preventing similar incidents in the future.</p>
            
            <p>Thank you for your understanding.</p>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
              This is an automated notification sent to all registered users. If you no longer wish to receive these notifications, you can adjust your settings in your account preferences.
            </p>
          </div>
        </body>
        </html>
      `;

      return resend.emails.send({
        from: 'security@yourdomain.com',
        to: userProfile.email,
        subject: requestBody.subject,
        html: htmlContent
      });
    });

    // Wait for all emails to be sent
    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    return new Response(
      JSON.stringify({ 
        message: `Breach notification sent successfully`,
        statistics: {
          total_recipients: users.length,
          successful_sends: successful,
          failed_sends: failed
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-breach-notification function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});