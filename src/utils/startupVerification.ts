
import { runLightweightSystemCheck } from './buildVerification';
import { runQuickPublishingCheck } from './publishingVerification';

// Enhanced startup verification with comprehensive publishing readiness
export const runStartupVerification = async () => {
  console.log('🚀 Starting Enhanced Application Verification...');
  
  try {
    // Run core system checks
    const systemStatus = await runLightweightSystemCheck();
    
    // Run enhanced publishing verification
    let publishingStatus = null;
    try {
      publishingStatus = await runQuickPublishingCheck();
    } catch (err) {
      console.warn('⚠️ Publishing verification failed:', err);
      publishingStatus = { allPassed: false, error: err instanceof Error ? err.message : 'Unknown error' };
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
    }
    
    // Report publishing status
    if (publishingStatus) {
      if (publishingStatus.allPassed) {
        console.log('🚀 Publishing readiness: ✅ Ready to publish');
      } else {
        console.warn('🚀 Publishing readiness: ❌ Issues detected - check verification logs above');
        
        if (publishingStatus.error) {
          console.error('🚨 Publishing error:', publishingStatus.error);
        }
      }
    }
    
    return {
      ...systemStatus,
      publishingStatus,
      overallHealthy: systemStatus.allChecksPass && (publishingStatus?.allPassed ?? false)
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

// Manual publishing verification trigger
export const runManualPublishingCheck = async () => {
  console.log('\n🔍 Running Manual Publishing Verification...');
  
  try {
    const { runPublishingVerification } = await import('./publishingVerification');
    const result = await runPublishingVerification();
    
    if (result.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL PUBLISHING ISSUES FOUND:');
      result.criticalIssues.forEach(({ check, issue }) => {
        console.error(`❌ ${check}: ${issue}`);
      });
      
      console.log('\n💡 RECOMMENDATIONS:');
      result.recommendations.forEach(rec => {
        console.log(`  • ${rec}`);
      });
    }
    
    return result;
  } catch (err) {
    console.error('❌ Manual publishing check failed:', err);
    return null;
  }
};
