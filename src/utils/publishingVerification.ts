
// Enhanced publishing verification with specific checks for deployment issues
import { verifyEnvironmentVariables } from './verification/environmentVerification';
import { verifyBuildCompatibility, verifyCodeSyntax, verifyImportPaths } from './verification/buildVerification';
import { verifyAssetReferences } from './verification/assetVerification';
import { verifyDependencies } from './verification/dependencyVerification';
import { verifySupabaseForPublishing } from './verification/supabaseVerification';
import { verifyBundleSize, verifyMemoryUsage, verifyNetworkRequests } from './verification/performanceVerification';
import { generatePublishingRecommendations } from './verification/publishingRecommendations';

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
