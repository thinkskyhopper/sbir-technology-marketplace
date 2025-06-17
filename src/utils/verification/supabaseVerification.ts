
export const verifySupabaseForPublishing = async () => {
  try {
    // Import Supabase client
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Test basic connectivity with minimal query
    const { error } = await supabase.from('sbir_listings').select('id').limit(1);
    
    if (error) {
      return {
        passed: false,
        critical: true,
        message: `Supabase connectivity issue: ${error.message}`
      };
    }
    
    // Test auth configuration
    const { data: { session } } = await supabase.auth.getSession();
    
    return {
      passed: true,
      critical: false,
      message: `Supabase connection verified${session ? ' (authenticated)' : ' (public access)'}`
    };
  } catch (err) {
    return {
      passed: false,
      critical: true,
      message: `Supabase verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};
