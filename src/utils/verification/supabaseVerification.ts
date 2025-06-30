
export const verifySupabaseForPublishing = async () => {
  try {
    console.log('🔍 Starting Supabase verification...');
    
    // Import Supabase client
    const { supabase } = await import('@/integrations/supabase/client');
    
    console.log('📡 Testing Supabase connection...');
    
    // Test basic connectivity with minimal query
    const { data, error } = await supabase.from('sbir_listings').select('id').limit(1);
    
    if (error) {
      console.error('❌ Supabase connectivity error:', error);
      return {
        passed: false,
        critical: true,
        message: `Supabase connectivity issue: ${error.message}`
      };
    }
    
    console.log('✅ Supabase basic query successful');
    
    // Test auth configuration
    const { data: { session } } = await supabase.auth.getSession();
    
    console.log('🔐 Auth session check:', session ? 'authenticated' : 'public access');
    
    return {
      passed: true,
      critical: false,
      message: `Supabase connection verified${session ? ' (authenticated)' : ' (public access)'}`
    };
  } catch (err) {
    console.error('💥 Supabase verification failed:', err);
    return {
      passed: false,
      critical: true,
      message: `Supabase verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};
