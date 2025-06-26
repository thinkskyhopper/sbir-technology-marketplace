
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

export interface AdminProfile {
  email: string;
  full_name: string;
}

export const fetchAdminUsers = async (): Promise<string[]> => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { data: adminProfiles, error: adminError } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('role', 'admin')
    .order('email');

  if (adminError) {
    console.error('Error fetching admin users:', adminError);
    throw new Error('Failed to fetch admin users');
  }

  if (!adminProfiles || adminProfiles.length === 0) {
    console.error('No admin users found');
    throw new Error('No admin users found');
  }

  const adminEmails = adminProfiles.map(profile => profile.email).filter(email => email);
  console.log('📧 Found admin users:', adminProfiles.length, 'validated emails:', adminEmails);

  return adminEmails;
};
