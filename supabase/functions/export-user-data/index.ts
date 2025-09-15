import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserDataExport {
  profile: any;
  listings: any[];
  exportDate: string;
  requestedBy: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    // Use service role for database operations after verifying the user token
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set the auth token
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user profile data using service role to safely bypass RLS
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }

    // Fetch user listings
    const { data: listings, error: listingsError } = await admin
      .from('sbir_listings')
      .select('*')
      .eq('user_id', user.id);

    if (listingsError) {
      throw new Error(`Failed to fetch listings: ${listingsError.message}`);
    }

    // Create comprehensive data export
    const safeProfile = profile
      ? {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          first_name: profile.first_name,
          last_name: profile.last_name,
          display_email: profile.display_email,
          company_name: profile.company_name,
          bio: profile.bio,
          role: profile.role,
          notification_categories: profile.notification_categories,
          marketing_emails_enabled: profile.marketing_emails_enabled,
          email_notifications_enabled: profile.email_notifications_enabled,
          listing_email_notifications_enabled: profile.listing_email_notifications_enabled,
          category_email_notifications_enabled: profile.category_email_notifications_enabled,
          can_submit_listings: profile.can_submit_listings,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }
      : {
          id: user.id,
          email: user.email ?? null,
          full_name: null,
          first_name: null,
          last_name: null,
          display_email: user.email ?? null,
          company_name: null,
          bio: null,
          role: 'user',
          notification_categories: [],
          marketing_emails_enabled: false,
          email_notifications_enabled: false,
          listing_email_notifications_enabled: false,
          category_email_notifications_enabled: false,
          can_submit_listings: false,
          created_at: user.created_at ?? new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

    const exportData: UserDataExport = {
      profile: safeProfile,
      listings: listings || [],
      exportDate: new Date().toISOString(),
      requestedBy: user.email || user.id
    };

    return new Response(
      JSON.stringify(exportData),
      { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="user-data-export-${user.id}-${new Date().toISOString().split('T')[0]}.json"`
        }
      }
    );

  } catch (error) {
    console.error('Error in export-user-data function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});