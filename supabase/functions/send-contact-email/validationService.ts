
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

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateContactRequest = (data: any): void => {
  // Check required fields exist
  if (!data.name || !data.email || !data.listing) {
    throw new Error('Missing required fields in contact request');
  }

  if (!data.listing.id || !data.listing.title) {
    throw new Error('Missing required listing information');
  }

  // Validate field lengths
  if (data.name.length > 200) {
    throw new Error('Name must be less than 200 characters');
  }

  if (data.email.length > 255) {
    throw new Error('Email must be less than 255 characters');
  }

  // Validate email format
  if (!EMAIL_REGEX.test(data.email)) {
    throw new Error('Invalid email format');
  }

  // Validate optional fields if present
  if (data.company && data.company.length > 200) {
    throw new Error('Company name must be less than 200 characters');
  }

  if (data.message && data.message.length > 5000) {
    throw new Error('Message must be less than 5000 characters');
  }

  if (data.referredBy && data.referredBy.length > 200) {
    throw new Error('Referral source must be less than 200 characters');
  }

  if (data.howDidYouFindUs && data.howDidYouFindUs.length > 200) {
    throw new Error('How did you find us must be less than 200 characters');
  }

  if (data.interestLevel && data.interestLevel.length > 100) {
    throw new Error('Interest level must be less than 100 characters');
  }

  if (data.experience && data.experience.length > 100) {
    throw new Error('Experience must be less than 100 characters');
  }

  if (data.timeline && data.timeline.length > 100) {
    throw new Error('Timeline must be less than 100 characters');
  }
};
