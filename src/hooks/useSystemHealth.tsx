
import { useState, useEffect } from 'react';
import { runLightweightSystemCheck } from '@/utils/buildVerification';
import { prepareForPublishing } from '@/utils/publishingOptimization';

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
      
      // Check publishing readiness
      let publishingStatus = null;
      try {
        publishingStatus = await prepareForPublishing();
      } catch (err) {
        console.warn('⚠️ Publishing check skipped:', err);
      }
      
      setHealth({
        ...status,
        publishingReady: publishingStatus?.readyToPublish ?? true,
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

  useEffect(() => {
    checkSystemHealth();
  }, []);

  return {
    ...health,
    recheckHealth: checkSystemHealth
  };
};
