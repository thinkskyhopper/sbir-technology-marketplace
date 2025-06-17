
export const verifyEnvironmentVariables = () => {
  try {
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => {
      const value = import.meta.env[varName];
      return !value || value === 'undefined' || value === '';
    });
    
    if (missingVars.length > 0) {
      return {
        passed: false,
        critical: true,
        message: `Missing environment variables: ${missingVars.join(', ')}`
      };
    }
    
    // Check for placeholder values
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl?.includes('your-project-ref') || supabaseKey?.includes('your-anon-key')) {
      return {
        passed: false,
        critical: true,
        message: 'Environment variables contain placeholder values'
      };
    }
    
    return {
      passed: true,
      critical: false,
      message: 'All environment variables properly configured'
    };
  } catch (err) {
    return {
      passed: false,
      critical: true,
      message: `Environment check failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};
