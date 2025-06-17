
import { useState, useEffect } from 'react';
import { runFullSystemCheck } from '@/utils/buildVerification';

interface SystemHealth {
  buildHealthy: boolean;
  dependenciesHealthy: boolean;
  supabaseConnected: boolean;
  authConfigured: boolean;
  allChecksPass: boolean;
  isLoading: boolean;
  error: string | null;
  dependencyDetails?: any;
}

export const useSystemHealth = () => {
  const [health, setHealth] = useState<SystemHealth>({
    buildHealthy: false,
    dependenciesHealthy: false,
    supabaseConnected: false,
    authConfigured: false,
    allChecksPass: false,
    isLoading: true,
    error: null
  });

  const checkSystemHealth = async () => {
    try {
      setHealth(prev => ({ ...prev, isLoading: true, error: null }));
      
      const status = await runFullSystemCheck();
      
      setHealth({
        ...status,
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
