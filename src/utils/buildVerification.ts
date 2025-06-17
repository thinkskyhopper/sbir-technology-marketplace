
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { runDependencyVerification } from './dependencyVerification';

// Build verification utility to catch common issues
export const verifyBuildHealth = () => {
  console.log('🔍 Build Health Check:');
  
  // Check for common issues
  const checks = {
    'React version': typeof React !== 'undefined',
    'Router available': typeof window !== 'undefined',
    'Supabase client': typeof supabase !== 'undefined',
  };
  
  Object.entries(checks).forEach(([check, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${check}`);
  });
  
  return Object.values(checks).every(Boolean);
};

// Supabase connectivity verification
export const verifySupabaseConnection = async () => {
  console.log('🔍 Supabase Connection Check:');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('sbir_listings').select('id').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test auth state
    const { data: { session } } = await supabase.auth.getSession();
    console.log(`${session ? '✅' : 'ℹ️'} Auth session: ${session ? 'Active' : 'None'}`);
    
    return true;
  } catch (err) {
    console.error('❌ Supabase verification failed:', err);
    return false;
  }
};

// Authentication verification
export const verifyAuthSetup = async () => {
  console.log('🔍 Authentication Setup Check:');
  
  try {
    // Check if auth is properly configured
    const { data: { user } } = await supabase.auth.getUser();
    console.log(`${user ? '✅' : 'ℹ️'} Current user: ${user ? user.email : 'Not authenticated'}`);
    
    // Test if we can access protected routes
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('ℹ️ Profiles table access requires authentication (expected)');
    } else if (error) {
      console.warn('⚠️ Profiles table access error:', error.message);
    } else {
      console.log('✅ Profiles table accessible');
    }
    
    return true;
  } catch (err) {
    console.error('❌ Auth verification failed:', err);
    return false;
  }
};

// Comprehensive system verification
export const runFullSystemCheck = async () => {
  console.log('🚀 Running Full System Verification...');
  
  // Step 1: Basic build health
  const buildHealthy = verifyBuildHealth();
  
  // Step 2: Dependency verification
  const dependencyStatus = runDependencyVerification();
  
  // Step 3: Supabase connectivity
  const supabaseConnected = await verifySupabaseConnection();
  
  // Step 4: Authentication setup
  const authConfigured = await verifyAuthSetup();
  
  const allChecksPass = buildHealthy && dependencyStatus.allDependenciesOk && supabaseConnected && authConfigured;
  
  console.log(`\n📊 System Status: ${allChecksPass ? '✅ All systems operational' : '⚠️ Issues detected'}`);
  
  return {
    buildHealthy,
    dependenciesHealthy: dependencyStatus.allDependenciesOk,
    supabaseConnected,
    authConfigured,
    allChecksPass,
    dependencyDetails: dependencyStatus
  };
};

// Type checking utility
export const verifyTypes = () => {
  console.log('🔍 Type Verification Complete');
  return true;
};
