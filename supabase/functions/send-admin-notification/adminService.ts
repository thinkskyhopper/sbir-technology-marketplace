
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import type { AdminProfile } from './types.ts';

export const fetchAdminUsers = async (): Promise<string[]> => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required Supabase environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('👥 Fetching admin users...');
  const { data: adminProfiles, error: adminError } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('role', 'admin')
    .order('email');

  if (adminError) {
    console.error('❌ Error fetching admin profiles:', adminError);
    throw new Error(`Failed to fetch admin profiles: ${adminError.message}`);
  }

  if (!adminProfiles || adminProfiles.length === 0) {
    console.log('⚠️ No admin users found');
    return [];
  }

  const adminEmails = adminProfiles.map(profile => profile.email).filter(email => email);
  console.log(`👥 Found ${adminProfiles.length} admin users:`, adminProfiles.map(p => p.email));
  console.log('📧 Validated admin emails:', adminEmails);

  return adminEmails;
};
