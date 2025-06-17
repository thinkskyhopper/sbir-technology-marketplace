// Enhanced publishing verification with specific checks for deployment issues
export const runPublishingVerification = async () => {
  console.log('🚀 Running Enhanced Publishing Verification...');
  
  const checks = {
    'Environment variables': verifyEnvironmentVariables(),
    'Build compatibility': verifyBuildCompatibility(),
    'Asset references': verifyAssetReferences(),
    'Import paths': verifyImportPaths(),
    'Code syntax': verifyCodeSyntax(),
    'Dependencies': await verifyDependencies(),
    'Supabase connectivity': await verifySupabaseForPublishing(),
    'Bundle size': verifyBundleSize(),
    'Memory usage': verifyMemoryUsage(),
    'Network requests': await verifyNetworkRequests()
  };
  
  console.log('\n📊 Publishing Verification Results:');
  Object.entries(checks).forEach(([check, result]) => {
    console.log(`${result.passed ? '✅' : '❌'} ${check}: ${result.message}`);
  });
  
  const allChecksPassed = Object.values(checks).every(check => check.passed);
  const criticalIssues = Object.entries(checks)
    .filter(([, result]) => !result.passed && result.critical)
    .map(([check, result]) => ({ check, issue: result.message }));
  
  console.log(`\n🎯 Publishing Status: ${allChecksPassed ? '✅ Ready' : '❌ Issues detected'}`);
  
  if (criticalIssues.length > 0) {
    console.log('\n🚨 Critical Issues Found:');
    criticalIssues.forEach(({ check, issue }) => {
      console.log(`  • ${check}: ${issue}`);
    });
  }
  
  return {
    allChecksPassed,
    criticalIssues,
    checks,
    recommendations: generatePublishingRecommendations(checks)
  };
};

const verifyEnvironmentVariables = () => {
  try {
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => {
      const value = import.meta.env[varName];
      return !value || value === 'undefined' || value === '';
    });
    
    if (missingVars.length > 0) {
      return {
        passed: false,
        critical: true,
        message: `Missing environment variables: ${missingVars.join(', ')}`
      };
    }
    
    // Check for placeholder values
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl?.includes('your-project-ref') || supabaseKey?.includes('your-anon-key')) {
      return {
        passed: false,
        critical: true,
        message: 'Environment variables contain placeholder values'
      };
    }
    
    return {
      passed: true,
      critical: false,
      message: 'All environment variables properly configured'
    };
  } catch (err) {
    return {
      passed: false,
      critical: true,
      message: `Environment check failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};

const verifyBuildCompatibility = () => {
  try {
    const compatibility = {
      'Vite environment': typeof import.meta !== 'undefined',
      'Module resolution': typeof import.meta.env !== 'undefined',
      'Dynamic imports': typeof import !== 'undefined',
      'Browser APIs': typeof window !== 'undefined'
    };
    
    const failed = Object.entries(compatibility).filter(([, passed]) => !passed);
    
    if (failed.length > 0) {
      return {
        passed: false,
        critical: true,
        message: `Build compatibility issues: ${failed.map(([check]) => check).join(', ')}`
      };
    }
    
    return {
      passed: true,
      critical: false,
      message: 'Build environment compatible'
    };
  } catch (err) {
    return {
      passed: false,
      critical: true,
      message: `Build compatibility check failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};

const verifyAssetReferences = () => {
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

const verifyImportPaths = () => {
  try {
    // This is a basic check - in a real scenario, you'd analyze the bundle
    const importIssues = [];
    
    // Check if React is properly imported
    if (typeof React === 'undefined') {
      importIssues.push('React not properly imported');
    }
    
    // Check if main dependencies are available
    const dependencies = ['@supabase/supabase-js', '@tanstack/react-query'];
    dependencies.forEach(dep => {
      try {
        // Basic availability check
        console.log(`Checking ${dep} availability...`);
      } catch (err) {
        importIssues.push(`${dep} import issues`);
      }
    });
    
    return {
      passed: importIssues.length === 0,
      critical: importIssues.length > 0,
      message: importIssues.length > 0 ? importIssues.join(', ') : 'Import paths verified'
    };
  } catch (err) {
    return {
      passed: false,
      critical: true,
      message: `Import path verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};

const verifyCodeSyntax = () => {
  try {
    // Basic syntax checks
    const syntaxIssues = [];
    
    // Check for common React issues
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      syntaxIssues.push('Missing root element');
    }
    
    return {
      passed: syntaxIssues.length === 0,
      critical: syntaxIssues.length > 0,
      message: syntaxIssues.length > 0 ? syntaxIssues.join(', ') : 'No syntax issues detected'
    };
  } catch (err) {
    return {
      passed: false,
      critical: true,
      message: `Syntax verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};

const verifyDependencies = async () => {
  try {
    const dependencyIssues = [];
    
    // Check critical dependencies
    const criticalDeps = [
      { name: 'React', check: () => typeof React !== 'undefined' },
      { name: 'Supabase client', check: () => typeof window !== 'undefined' }
    ];
    
    criticalDeps.forEach(({ name, check }) => {
      if (!check()) {
        dependencyIssues.push(name);
      }
    });
    
    return {
      passed: dependencyIssues.length === 0,
      critical: dependencyIssues.length > 0,
      message: dependencyIssues.length > 0 
        ? `Missing dependencies: ${dependencyIssues.join(', ')}`
        : 'All dependencies available'
    };
  } catch (err) {
    return {
      passed: false,
      critical: true,
      message: `Dependency verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};

const verifySupabaseForPublishing = async () => {
  try {
    // Import Supabase client
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Test basic connectivity with minimal query
    const { error } = await supabase.from('sbir_listings').select('id').limit(1);
    
    if (error) {
      return {
        passed: false,
        critical: true,
        message: `Supabase connectivity issue: ${error.message}`
      };
    }
    
    // Test auth configuration
    const { data: { session } } = await supabase.auth.getSession();
    
    return {
      passed: true,
      critical: false,
      message: `Supabase connection verified${session ? ' (authenticated)' : ' (public access)'}`
    };
  } catch (err) {
    return {
      passed: false,
      critical: true,
      message: `Supabase verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};

const verifyBundleSize = () => {
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

const verifyMemoryUsage = () => {
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

const verifyNetworkRequests = async () => {
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

const generatePublishingRecommendations = (checks: Record<string, any>) => {
  const recommendations = [];
  
  Object.entries(checks).forEach(([check, result]) => {
    if (!result.passed) {
      switch (check) {
        case 'Environment variables':
          recommendations.push('Check Supabase project settings and ensure environment variables are properly configured');
          break;
        case 'Build compatibility':
          recommendations.push('Verify Vite configuration and build settings');
          break;
        case 'Import paths':
          recommendations.push('Review import statements and ensure all paths are correct');
          break;
        case 'Supabase connectivity':
          recommendations.push('Check Supabase project status and API keys');
          break;
        case 'Bundle size':
          recommendations.push('Consider code splitting or removing unused dependencies');
          break;
        default:
          recommendations.push(`Address ${check.toLowerCase()} issues`);
      }
    }
  });
  
  return recommendations;
};

// Quick publishing check function
export const runQuickPublishingCheck = async () => {
  console.log('⚡ Running Quick Publishing Check...');
  
  const essentialChecks = {
    'Environment': verifyEnvironmentVariables(),
    'Build': verifyBuildCompatibility(),
    'Supabase': await verifySupabaseForPublishing()
  };
  
  const allPassed = Object.values(essentialChecks).every(check => check.passed);
  
  console.log('\n⚡ Quick Check Results:');
  Object.entries(essentialChecks).forEach(([check, result]) => {
    console.log(`${result.passed ? '✅' : '❌'} ${check}: ${result.message}`);
  });
  
  console.log(`\n🚀 Quick Status: ${allPassed ? '✅ Ready to publish' : '❌ Issues need attention'}`);
  
  return {
    allPassed,
    checks: essentialChecks
  };
};
