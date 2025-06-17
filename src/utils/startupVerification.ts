
import { runFullSystemCheck } from './buildVerification';

// Startup verification that runs comprehensive checks
export const runStartupVerification = async () => {
  console.log('🚀 Starting Application Verification...');
  
  try {
    // Run all system checks
    const systemStatus = await runFullSystemCheck();
    
    if (!systemStatus.allChecksPass) {
      console.warn('⚠️ Some system checks failed. Review logs above for details.');
      
      // Log specific issues
      if (!systemStatus.buildHealthy) {
        console.error('❌ Build health issues detected');
      }
      if (!systemStatus.dependenciesHealthy) {
        console.error('❌ Dependency issues detected');
      }
      if (!systemStatus.supabaseConnected) {
        console.error('❌ Supabase connectivity issues detected');
      }
      if (!systemStatus.authConfigured) {
        console.error('❌ Authentication configuration issues detected');
      }
    } else {
      console.log('✅ All startup verification checks passed');
    }
    
    return systemStatus;
  } catch (err) {
    console.error('❌ Startup verification failed:', err);
    return {
      buildHealthy: false,
      dependenciesHealthy: false,
      supabaseConnected: false,
      authConfigured: false,
      allChecksPass: false,
      error: err instanceof Error ? err.message : 'Unknown startup error'
    };
  }
};

// Performance monitoring during startup
export const monitorStartupPerformance = () => {
  const startTime = performance.now();
  
  return {
    getElapsedTime: () => {
      const elapsed = performance.now() - startTime;
      console.log(`⏱️ Startup time: ${elapsed.toFixed(2)}ms`);
      return elapsed;
    }
  };
};
