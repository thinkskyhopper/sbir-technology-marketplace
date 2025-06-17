
import { runLightweightSystemCheck } from './buildVerification';

// Lightweight startup verification optimized for publishing
export const runStartupVerification = async () => {
  console.log('🚀 Starting Lightweight Application Verification...');
  
  try {
    // Run lightweight system checks to avoid publishing conflicts
    const systemStatus = await runLightweightSystemCheck();
    
    if (!systemStatus.allChecksPass) {
      console.warn('⚠️ Some system checks failed. Review logs above for details.');
      
      // Log specific issues without extensive debugging
      if (!systemStatus.buildHealthy) {
        console.error('❌ Build health issues detected');
      }
      if (!systemStatus.dependenciesHealthy) {
        console.error('❌ Dependency issues detected');
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

// Optimized performance monitoring
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
