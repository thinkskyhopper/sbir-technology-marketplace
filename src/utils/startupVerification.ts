import { supabase } from '@/integrations/supabase/client';

/**
 * Lightweight startup verification — checks Supabase connectivity in dev mode.
 */
export const runStartupVerification = async () => {
  if (import.meta.env.DEV) {
    console.log('🚀 Running startup verification...');
  }

  try {
    const { error } = await supabase.from('sbir_listings').select('id').limit(1);
    const supabaseConnected = !error;

    if (import.meta.env.DEV) {
      console.log(supabaseConnected
        ? '✅ Supabase connection verified'
        : `❌ Supabase connection failed: ${error?.message}`
      );
    }

    return {
      buildHealthy: true,
      dependenciesHealthy: true,
      supabaseConnected,
      authConfigured: true,
      allChecksPass: supabaseConnected,
    };
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('❌ Startup verification failed:', err);
    }
    return {
      buildHealthy: true,
      dependenciesHealthy: true,
      supabaseConnected: false,
      authConfigured: true,
      allChecksPass: false,
      error: err instanceof Error ? err.message : 'Unknown startup error',
    };
  }
};

export const monitorStartupPerformance = () => {
  const startTime = performance.now();

  return {
    getElapsedTime: () => {
      const elapsed = performance.now() - startTime;
      if (import.meta.env.DEV) {
        console.log(`⏱️ Startup time: ${elapsed.toFixed(2)}ms`);
      }
      return elapsed;
    },
  };
};
