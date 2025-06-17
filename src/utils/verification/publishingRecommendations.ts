
export const generatePublishingRecommendations = (checks: Record<string, any>) => {
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
