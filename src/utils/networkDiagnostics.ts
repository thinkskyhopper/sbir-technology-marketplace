import { supabase } from '@/integrations/supabase/client';

export interface NetworkDiagnostics {
  isVpnDetected: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'very-poor';
  latency: number;
  canReachSupabase: boolean;
  dnsResolutionTime: number;
  recommendedTimeout: number;
  errors: string[];
}

export class NetworkDiagnosticsService {
  private supabaseUrl = 'https://amhznlnhrrugxatbeayo.supabase.co';
  
  async runDiagnostics(): Promise<NetworkDiagnostics> {
    console.log('🔍 Running network diagnostics...');
    
    const diagnostics: NetworkDiagnostics = {
      isVpnDetected: false,
      connectionQuality: 'excellent',
      latency: 0,
      canReachSupabase: false,
      dnsResolutionTime: 0,
      recommendedTimeout: 10000,
      errors: []
    };

    try {
      // Test 1: Basic connectivity to Supabase
      await this.testSupabaseConnectivity(diagnostics);
      
      // Test 2: Measure latency
      await this.measureLatency(diagnostics);
      
      // Test 3: VPN detection heuristics
      await this.detectVpnIndicators(diagnostics);
      
      // Test 4: DNS resolution timing
      await this.measureDnsResolution(diagnostics);
      
      // Calculate overall connection quality
      this.calculateConnectionQuality(diagnostics);
      
      console.log('✅ Network diagnostics complete:', diagnostics);
    } catch (error) {
      console.error('❌ Network diagnostics failed:', error);
      diagnostics.errors.push(`Diagnostics failed: ${error}`);
    }

    return diagnostics;
  }

  private async testSupabaseConnectivity(diagnostics: NetworkDiagnostics): Promise<void> {
    try {
      const start = performance.now();
      
      // Simple health check - try to reach Supabase
      const { error } = await supabase.from('profiles').select('count').limit(1);
      
      const end = performance.now();
      diagnostics.latency = end - start;
      
      if (error) {
        diagnostics.canReachSupabase = false;
        diagnostics.errors.push(`Supabase connectivity failed: ${error.message}`);
      } else {
        diagnostics.canReachSupabase = true;
      }
    } catch (error) {
      diagnostics.canReachSupabase = false;
      diagnostics.errors.push(`Connection test failed: ${error}`);
    }
  }

  private async measureLatency(diagnostics: NetworkDiagnostics): Promise<void> {
    const measurements: number[] = [];
    
    // Take multiple measurements for accuracy
    for (let i = 0; i < 3; i++) {
      try {
        const start = performance.now();
        
        await fetch(`${this.supabaseUrl}/rest/v1/`, {
          method: 'HEAD',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaHpubG5ocnJ1Z3hhdGJlYXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDA2NDUsImV4cCI6MjA2NTY3NjY0NX0.36_2NRiObrLxWx_ngeNzMvOSzxcFpeGXh-xKoW4irkk'
          }
        });
        
        const end = performance.now();
        measurements.push(end - start);
        
        // Small delay between measurements
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        diagnostics.errors.push(`Latency measurement ${i + 1} failed: ${error}`);
      }
    }

    if (measurements.length > 0) {
      diagnostics.latency = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    }
  }

  private async detectVpnIndicators(diagnostics: NetworkDiagnostics): Promise<void> {
    const indicators: string[] = [];
    
    try {
      // Check if WebRTC can detect IP information
      // This is a simplified VPN detection - real VPNs might still be undetected
      const rtcTest = await this.testWebRTC();
      if (rtcTest.multipleIPs) {
        indicators.push('Multiple IP addresses detected');
      }
      
      // Check for common VPN-related network characteristics
      if (diagnostics.latency > 1000) {
        indicators.push('High latency (>1s) may indicate VPN routing');
      }
      
      // Check for suspicious DNS behavior
      if (diagnostics.dnsResolutionTime > 500) {
        indicators.push('Slow DNS resolution may indicate VPN DNS');
      }
      
      diagnostics.isVpnDetected = indicators.length >= 2;
      
      if (indicators.length > 0) {
        diagnostics.errors.push(`VPN indicators: ${indicators.join(', ')}`);
      }
    } catch (error) {
      diagnostics.errors.push(`VPN detection failed: ${error}`);
    }
  }

  private async testWebRTC(): Promise<{ multipleIPs: boolean }> {
    return new Promise((resolve) => {
      const ips: string[] = [];
      
      // Create a minimal WebRTC connection to detect local IPs
      const rtc = new RTCPeerConnection({ iceServers: [] });
      
      rtc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const ipMatch = candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/);
          if (ipMatch && !ips.includes(ipMatch[0])) {
            ips.push(ipMatch[0]);
          }
        }
      };
      
      rtc.createDataChannel('');
      rtc.createOffer().then((offer) => rtc.setLocalDescription(offer));
      
      // Give it a short time to gather candidates
      setTimeout(() => {
        rtc.close();
        resolve({ multipleIPs: ips.length > 1 });
      }, 1000);
    });
  }

  private async measureDnsResolution(diagnostics: NetworkDiagnostics): Promise<void> {
    try {
      const start = performance.now();
      
      // This is a rough approximation - actual DNS timing is harder to measure in browser
      await fetch(`${this.supabaseUrl}/rest/v1/`, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const end = performance.now();
      diagnostics.dnsResolutionTime = end - start;
    } catch (error) {
      diagnostics.errors.push(`DNS resolution test failed: ${error}`);
    }
  }

  private calculateConnectionQuality(diagnostics: NetworkDiagnostics): void {
    let score = 100;
    
    // Deduct points for various issues
    if (!diagnostics.canReachSupabase) score -= 50;
    if (diagnostics.latency > 2000) score -= 30;
    else if (diagnostics.latency > 1000) score -= 20;
    else if (diagnostics.latency > 500) score -= 10;
    
    if (diagnostics.dnsResolutionTime > 1000) score -= 20;
    else if (diagnostics.dnsResolutionTime > 500) score -= 10;
    
    if (diagnostics.isVpnDetected) score -= 15;
    
    // Determine quality level
    if (score >= 80) diagnostics.connectionQuality = 'excellent';
    else if (score >= 60) diagnostics.connectionQuality = 'good';
    else if (score >= 30) diagnostics.connectionQuality = 'poor';
    else diagnostics.connectionQuality = 'very-poor';
    
    // Recommend timeout based on connection quality
    diagnostics.recommendedTimeout = Math.max(
      10000, // Minimum 10 seconds
      diagnostics.latency * 3, // 3x the measured latency
      diagnostics.isVpnDetected ? 30000 : 15000 // Extra time for VPN
    );
  }

  async quickConnectivityTest(): Promise<boolean> {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${this.supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaHpubG5ocnJ1Z3hhdGJlYXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDA2NDUsImV4cCI6MjA2NTY3NjY0NX0.36_2NRiObrLxWx_ngeNzMvOSzxcFpeGXh-xKoW4irkk'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.warn('Quick connectivity test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const networkDiagnostics = new NetworkDiagnosticsService();