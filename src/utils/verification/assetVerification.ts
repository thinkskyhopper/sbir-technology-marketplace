
export const verifyAssetReferences = () => {
  try {
    // Check for common asset reference issues
    const issues = [];
    
    // Check for absolute paths in code (which might break in production)
    const hasAbsolutePaths = document.querySelectorAll('img[src^="/"], link[href^="/"]').length > 0;
    if (hasAbsolutePaths) {
      issues.push('Absolute asset paths detected');
    }
    
    // Check for missing favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      issues.push('Missing favicon');
    }
    
    return {
      passed: issues.length === 0,
      critical: false,
      message: issues.length > 0 ? issues.join(', ') : 'Asset references verified'
    };
  } catch (err) {
    return {
      passed: false,
      critical: false,
      message: `Asset verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};
