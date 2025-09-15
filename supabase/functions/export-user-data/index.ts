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

    // Fetch user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw new Error(`Failed to fetch profile: ${profileError.message}`);
    }

    // Fetch user listings
    const { data: listings, error: listingsError } = await supabase
      .from('sbir_listings')
      .select('*')
      .eq('user_id', user.id);

    if (listingsError) {
      throw new Error(`Failed to fetch listings: ${listingsError.message}`);
    }

    // Create comprehensive data export
    const exportData: UserDataExport = {
      profile: {
        ...profile,
        // Remove sensitive internal fields
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
      },
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