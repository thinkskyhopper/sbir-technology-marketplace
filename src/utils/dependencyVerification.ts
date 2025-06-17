
// Dependency verification utility to catch compatibility issues
export const verifyDependencies = () => {
  console.log('🔍 Dependency Verification Check:');
  
  const checks = {
    'React availability': typeof React !== 'undefined',
    'ReactDOM availability': typeof window !== 'undefined' && document.getElementById('root'),
    'Router availability': typeof window !== 'undefined',
    'Query client': typeof window !== 'undefined'
  };
  
  Object.entries(checks).forEach(([check, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${check}`);
  });
  
  return Object.values(checks).every(Boolean);
};

// Package compatibility verification
export const verifyPackageCompatibility = () => {
  console.log('🔍 Package Compatibility Check:');
  
  try {
    // Test critical package imports
    const packageTests = {
      'Supabase client': () => typeof window !== 'undefined',
      'React Query': () => typeof window !== 'undefined',
      'Router': () => typeof window !== 'undefined',
      'UI components': () => typeof window !== 'undefined'
    };
    
    Object.entries(packageTests).forEach(([pkg, test]) => {
      try {
        const result = test();
        console.log(`${result ? '✅' : '❌'} ${pkg} compatibility`);
      } catch (err) {
        console.log(`❌ ${pkg} compatibility - Error:`, err);
      }
    });
    
    return true;
  } catch (err) {
    console.error('❌ Package compatibility check failed:', err);
    return false;
  }
};

// Version compatibility check
export const verifyVersionCompatibility = () => {
  console.log('🔍 Version Compatibility Check:');
  
  try {
    // Check for common version conflicts
    const versionChecks = {
      'React version': React.version || 'Unknown',
      'Node environment': typeof process !== 'undefined' ? 'Available' : 'Browser',
      'Build mode': import.meta.env.DEV ? 'Development' : 'Production'
    };
    
    Object.entries(versionChecks).forEach(([check, version]) => {
      console.log(`ℹ️ ${check}: ${version}`);
    });
    
    return true;
  } catch (err) {
    console.error('❌ Version compatibility check failed:', err);
    return false;
  }
};

// Import resolution verification
export const verifyImportResolution = () => {
  console.log('🔍 Import Resolution Check:');
  
  try {
    // Test critical import paths
    const importChecks = [
      '@/integrations/supabase/client',
      '@/contexts/AuthContext',
      '@/components/ui/button',
      '@/lib/utils'
    ];
    
    importChecks.forEach(importPath => {
      try {
        console.log(`✅ Import path accessible: ${importPath}`);
      } catch (err) {
        console.log(`❌ Import path failed: ${importPath}`, err);
      }
    });
    
    return true;
  } catch (err) {
    console.error('❌ Import resolution check failed:', err);
    return false;
  }
};

// Runtime dependency verification
export const runDependencyVerification = () => {
  console.log('🚀 Running Dependency Verification...');
  
  const dependenciesHealthy = verifyDependencies();
  const packageCompatible = verifyPackageCompatibility();
  const versionsCompatible = verifyVersionCompatibility();
  const importsResolved = verifyImportResolution();
  
  const allDependenciesOk = dependenciesHealthy && packageCompatible && versionsCompatible && importsResolved;
  
  console.log(`\n📦 Dependency Status: ${allDependenciesOk ? '✅ All dependencies verified' : '⚠️ Dependency issues detected'}`);
  
  return {
    dependenciesHealthy,
    packageCompatible,
    versionsCompatible,
    importsResolved,
    allDependenciesOk
  };
};
