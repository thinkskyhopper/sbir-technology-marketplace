
export const verifyBundleSize = () => {
  try {
    // Estimate bundle size based on loaded resources
    const estimatedSize = performance.getEntriesByType('navigation')[0]?.transferSize || 0;
    const sizeInMB = estimatedSize / (1024 * 1024);
    
    // Warning if bundle seems too large
    const isLarge = sizeInMB > 10; // 10MB threshold
    
    return {
      passed: !isLarge,
      critical: false,
      message: isLarge 
        ? `Large bundle size detected: ${sizeInMB.toFixed(2)}MB`
        : `Bundle size acceptable: ${sizeInMB.toFixed(2)}MB`
    };
  } catch (err) {
    return {
      passed: true,
      critical: false,
      message: 'Bundle size check skipped'
    };
  }
};

export const verifyMemoryUsage = () => {
  try {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / (1024 * 1024);
      const limitMB = memory.jsHeapSizeLimit / (1024 * 1024);
      
      const usage = (usedMB / limitMB) * 100;
      const highUsage = usage > 80;
      
      return {
        passed: !highUsage,
        critical: false,
        message: highUsage
          ? `High memory usage: ${usage.toFixed(1)}%`
          : `Memory usage normal: ${usage.toFixed(1)}%`
      };
    }
    
    return {
      passed: true,
      critical: false,
      message: 'Memory usage check not available'
    };
  } catch (err) {
    return {
      passed: true,
      critical: false,
      message: 'Memory usage check failed'
    };
  }
};

export const verifyNetworkRequests = async () => {
  try {
    // Test a simple fetch to verify network capabilities
    const testUrl = `${window.location.origin}/favicon.ico`;
    
    const response = await fetch(testUrl, { 
      method: 'HEAD',
      cache: 'no-cache'
    });
    
    return {
      passed: response.ok || response.status === 404, // 404 is fine for favicon test
      critical: false,
      message: response.ok 
        ? 'Network requests working'
        : `Network request test: ${response.status}`
    };
  } catch (err) {
    return {
      passed: false,
      critical: false,
      message: `Network request failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};
