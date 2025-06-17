
import { useState, useEffect } from 'react';
import { runLightweightSystemCheck } from '@/utils/buildVerification';
import { runManualPublishingCheck } from '@/utils/startupVerification';

interface SystemHealth {
  buildHealthy: boolean;
  dependenciesHealthy: boolean;
  supabaseConnected: boolean;
  authConfigured: boolean;
  allChecksPass: boolean;
  publishingReady: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useSystemHealth = () => {
  const [health, setHealth] = useState<SystemHealth>({
    buildHealthy: false,
    dependenciesHealthy: false,
    supabaseConnected: false,
    authConfigured: false,
    allChecksPass: false,
    publishingReady: false,
    isLoading: true,
    error: null
  });

  const checkSystemHealth = async () => {
    try {
      setHealth(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Run system checks
      const status = await runLightweightSystemCheck();
      
      // Check publishing readiness with enhanced verification
      let publishingReady = false;
      try {
        const publishingResult = await runManualPublishingCheck();
        publishingReady = publishingResult?.allChecksPassed ?? false;
        
        if (!publishingReady && publishingResult?.criticalIssues?.length) {
          console.warn('🚨 Publishing issues detected:', publishingResult.criticalIssues);
        }
      } catch (err) {
        console.warn('⚠️ Publishing check failed:', err);
      }
      
      setHealth({
        ...status,
        publishingReady,
        isLoading: false,
        error: null
      });
    } catch (err) {
      console.error('❌ System health check failed:', err);
      setHealth(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      }));
    }
  };

  const runPublishingDiagnostics = async () => {
    console.log('\n🔍 Running Publishing Diagnostics...');
    
    try {
      const publishingResult = await runManualPublishingCheck();
      
      if (publishingResult) {
        console.log('\n📋 PUBLISHING DIAGNOSTIC REPORT:');
        console.log(`Overall Status: ${publishingResult.allChecksPassed ? '✅ Ready' : '❌ Issues Found'}`);
        
        if (publishingResult.criticalIssues.length > 0) {
          console.log('\n🚨 Critical Issues:');
          publishingResult.criticalIssues.forEach(({ check, issue }) => {
            console.error(`  ❌ ${check}: ${issue}`);
          });
        }
        
        if (publishingResult.recommendations.length > 0) {
          console.log('\n💡 Recommendations:');
          publishingResult.recommendations.forEach(rec => {
            console.log(`  • ${rec}`);
          });
        }
        
        return publishingResult;
      }
    } catch (err) {
      console.error('❌ Publishing diagnostics failed:', err);
    }
    
    return null;
  };

  useEffect(() => {
    checkSystemHealth();
  }, []);

  return {
    ...health,
    recheckHealth: checkSystemHealth,
    runPublishingDiagnostics
  };
};
