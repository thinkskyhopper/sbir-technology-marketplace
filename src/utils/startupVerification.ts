
import { runLightweightSystemCheck } from './buildVerification';
import { prepareForPublishing } from './publishingOptimization';

// Enhanced startup verification with publishing readiness
export const runStartupVerification = async () => {
  console.log('🚀 Starting Enhanced Application Verification...');
  
  try {
    // Run core system checks
    const systemStatus = await runLightweightSystemCheck();
    
    // Run publishing readiness check in production mode
    let publishingStatus = null;
    if (!import.meta.env.DEV) {
      publishingStatus = await prepareForPublishing();
    }
    
    if (!systemStatus.allChecksPass) {
      console.warn('⚠️ Some system checks failed. Review logs above for details.');
      
      if (!systemStatus.buildHealthy) {
        console.error('❌ Build health issues detected');
      }
      if (!systemStatus.dependenciesHealthy) {
        console.error('❌ Dependency issues detected');
      }
      if (!systemStatus.supabaseConnected) {
        console.error('❌ Supabase connection issues detected');
      }
      if (!systemStatus.authConfigured) {
        console.error('❌ Authentication configuration issues detected');
      }
    } else {
      console.log('✅ All startup verification checks passed');
      
      if (publishingStatus) {
        console.log(`🚀 Publishing readiness: ${publishingStatus.readyToPublish ? 'Ready' : 'Needs attention'}`);
      }
    }
    
    return {
      ...systemStatus,
      publishingStatus,
      overallHealthy: systemStatus.allChecksPass && (publishingStatus?.readyToPublish ?? true)
    };
  } catch (err) {
    console.error('❌ Startup verification failed:', err);
    return {
      buildHealthy: false,
      dependenciesHealthy: false,
      supabaseConnected: false,
      authConfigured: false,
      allChecksPass: false,
      publishingStatus: null,
      overallHealthy: false,
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
