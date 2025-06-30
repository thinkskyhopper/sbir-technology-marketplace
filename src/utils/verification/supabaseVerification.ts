
export const verifySupabaseForPublishing = async () => {
  try {
    console.log('🔍 Starting comprehensive Supabase verification...');
    
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
    
    console.log('✅ Supabase basic query successful, found listings:', data?.length || 0);
    
    // Test auth configuration
    const { data: { session } } = await supabase.auth.getSession();
    
    console.log('🔐 Auth session check:', session ? `authenticated as ${session.user?.email}` : 'public access');
    
    // Test profiles table access
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .limit(1);
        
      if (profileError) {
        console.warn('⚠️ Profile table access issue:', profileError);
      } else {
        console.log('✅ Profiles table accessible, found profiles:', profileData?.length || 0);
      }
    } catch (err) {
      console.warn('⚠️ Profile test failed:', err);
    }
    
    return {
      passed: true,
      critical: false,
      message: `Supabase connection verified${session ? ` (authenticated as ${session.user?.email})` : ' (public access)'}`
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
