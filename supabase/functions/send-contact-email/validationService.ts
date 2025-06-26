
export const validateEnvironment = (): void => {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!resendApiKey) {
    console.error('❌ Missing RESEND_API_KEY environment variable');
    throw new Error('Missing RESEND_API_KEY environment variable');
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required Supabase environment variables');
    throw new Error('Missing required Supabase environment variables');
  }
};

export const validateContactRequest = (data: any): void => {
  if (!data.name || !data.email || !data.listing) {
    throw new Error('Missing required fields in contact request');
  }

  if (!data.listing.id || !data.listing.title) {
    throw new Error('Missing required listing information');
  }
};
