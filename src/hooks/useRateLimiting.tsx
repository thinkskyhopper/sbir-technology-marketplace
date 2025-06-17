
import { useState, useCallback } from 'react';

interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number; // Time window in milliseconds
}

export const useRateLimiting = (key: string, options: RateLimitOptions) => {
  const [attempts, setAttempts] = useState<{ [key: string]: number[] }>({});

  const isRateLimited = useCallback((identifier: string) => {
    const now = Date.now();
    const userKey = `${key}_${identifier}`;
    const userAttempts = attempts[userKey] || [];
    
    // Remove attempts outside the time window
    const validAttempts = userAttempts.filter(
      timestamp => now - timestamp < options.windowMs
    );
    
    return validAttempts.length >= options.maxAttempts;
  }, [attempts, key, options]);

  const recordAttempt = useCallback((identifier: string) => {
    const now = Date.now();
    const userKey = `${key}_${identifier}`;
    
    setAttempts(prev => ({
      ...prev,
      [userKey]: [...(prev[userKey] || []), now]
    }));
  }, [key]);

  const getRemainingTime = useCallback((identifier: string) => {
    const now = Date.now();
    const userKey = `${key}_${identifier}`;
    const userAttempts = attempts[userKey] || [];
    
    if (userAttempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...userAttempts);
    const timeUntilReset = options.windowMs - (now - oldestAttempt);
    
    return Math.max(0, Math.ceil(timeUntilReset / 1000)); // Return seconds
  }, [attempts, key, options]);

  return {
    isRateLimited,
    recordAttempt,
    getRemainingTime
  };
};
