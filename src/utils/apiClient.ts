import { supabase } from '@/integrations/supabase/client';

export interface ApiClientOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
}

export interface NetworkError extends Error {
  isNetworkError: boolean;
  isTimeout: boolean;
  isVpnRelated: boolean;
  statusCode?: number;
  originalError?: any;
}

export class ApiClient {
  private defaultOptions: Required<ApiClientOptions> = {
    timeout: 10000, // 10 seconds default
    retries: 3,
    retryDelay: 1000, // 1 second
    exponentialBackoff: true,
  };

  constructor(options: ApiClientOptions = {}) {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  private createNetworkError(message: string, originalError?: any, statusCode?: number): NetworkError {
    const error = new Error(message) as NetworkError;
    error.isNetworkError = true;
    error.isTimeout = message.includes('timeout') || originalError?.name === 'AbortError';
    error.isVpnRelated = this.detectVpnRelatedError(originalError, statusCode);
    error.statusCode = statusCode;
    error.originalError = originalError;
    return error;
  }

  private detectVpnRelatedError(error: any, statusCode?: number): boolean {
    // Common VPN-related error patterns
    const vpnIndicators = [
      'ERR_NAME_NOT_RESOLVED',
      'ERR_CONNECTION_TIMED_OUT',
      'ERR_CONNECTION_REFUSED',
      'ERR_NETWORK_CHANGED',
      'ERR_INTERNET_DISCONNECTED',
      'DNS_PROBE_FINISHED_NXDOMAIN',
      'ENOTFOUND',
      'ECONNREFUSED',
      'ETIMEDOUT'
    ];

    if (error?.message) {
      const errorMessage = error.message.toLowerCase();
      if (vpnIndicators.some(indicator => errorMessage.includes(indicator.toLowerCase()))) {
        return true;
      }
    }

    // Check for suspicious status codes that might indicate VPN blocking
    if (statusCode === 403 || statusCode === 429 || statusCode === 502 || statusCode === 503) {
      return true;
    }

    return false;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchWithRetry<T = any>(
    input: RequestInfo | URL,
    init: RequestInit = {},
    options: ApiClientOptions = {}
  ): Promise<T> {
    const config = { ...this.defaultOptions, ...options };
    let lastError: NetworkError;

    for (let attempt = 0; attempt <= config.retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      try {
        const response = await fetch(input, {
          ...init,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Check if it's a network-related error that might benefit from retry
          if (response.status >= 500 || response.status === 429) {
            throw this.createNetworkError(
              `HTTP ${response.status}: ${response.statusText}`,
              null,
              response.status
            );
          }
          
          // For 4xx errors, don't retry but still throw a network error for proper handling
          throw this.createNetworkError(
            `HTTP ${response.status}: ${response.statusText}`,
            null,
            response.status
          );
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        clearTimeout(timeoutId);
        
        lastError = this.createNetworkError(
          error.name === 'AbortError' 
            ? `Request timeout after ${config.timeout}ms`
            : `Network request failed: ${error.message}`,
          error
        );

        console.warn(`API request attempt ${attempt + 1} failed:`, lastError.message);

        // Don't retry on the last attempt
        if (attempt === config.retries) {
          break;
        }

        // Don't retry certain error types
        if (lastError.statusCode && lastError.statusCode >= 400 && lastError.statusCode < 500 && lastError.statusCode !== 429) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = config.exponentialBackoff 
          ? config.retryDelay * Math.pow(2, attempt)
          : config.retryDelay;

        console.log(`Retrying in ${delay}ms... (attempt ${attempt + 1}/${config.retries})`);
        await this.delay(delay);
      }
    }

    throw lastError!;
  }

  // Supabase-specific methods with retry logic
  async supabaseQuery<T = any>(
    query: any,
    options: ApiClientOptions = {}
  ): Promise<T> {
    const config = { ...this.defaultOptions, ...options };
    let lastError: NetworkError;

    for (let attempt = 0; attempt <= config.retries; attempt++) {
      try {
        const { data, error } = await query;
        
        if (error) {
          throw this.createNetworkError(
            `Supabase query failed: ${error.message}`,
            error,
            error.status || error.code
          );
        }

        return data;
      } catch (error: any) {
        lastError = error.isNetworkError 
          ? error 
          : this.createNetworkError(
              `Supabase query failed: ${error.message}`,
              error
            );

        console.warn(`Supabase query attempt ${attempt + 1} failed:`, lastError.message);

        // Don't retry on the last attempt
        if (attempt === config.retries) {
          break;
        }

        // Don't retry auth errors or client errors
        if (lastError.statusCode && lastError.statusCode >= 400 && lastError.statusCode < 500 && lastError.statusCode !== 429) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = config.exponentialBackoff 
          ? config.retryDelay * Math.pow(2, attempt)
          : config.retryDelay;

        console.log(`Retrying Supabase query in ${delay}ms... (attempt ${attempt + 1}/${config.retries})`);
        await this.delay(delay);
      }
    }

    throw lastError!;
  }

  // Edge function calls with retry logic
  async invokeEdgeFunction<T = any>(
    functionName: string,
    body: any,
    options: ApiClientOptions = {}
  ): Promise<T> {
    const config = { ...this.defaultOptions, ...options };
    let lastError: NetworkError;

    for (let attempt = 0; attempt <= config.retries; attempt++) {
      try {
        const { data, error } = await supabase.functions.invoke(functionName, { body });
        
        if (error) {
          throw this.createNetworkError(
            `Edge function '${functionName}' failed: ${error.message}`,
            error,
            error.status
          );
        }

        return data;
      } catch (error: any) {
        lastError = error.isNetworkError 
          ? error 
          : this.createNetworkError(
              `Edge function '${functionName}' failed: ${error.message}`,
              error
            );

        console.warn(`Edge function ${functionName} attempt ${attempt + 1} failed:`, lastError.message);

        // Don't retry on the last attempt
        if (attempt === config.retries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = config.exponentialBackoff 
          ? config.retryDelay * Math.pow(2, attempt)
          : config.retryDelay;

        console.log(`Retrying edge function ${functionName} in ${delay}ms... (attempt ${attempt + 1}/${config.retries})`);
        await this.delay(delay);
      }
    }

    throw lastError!;
  }
}

// Default API client instance
export const apiClient = new ApiClient();

// VPN-optimized client for critical operations
export const vpnOptimizedClient = new ApiClient({
  timeout: 30000, // 30 seconds for VPN users
  retries: 5,
  retryDelay: 2000, // 2 seconds initial delay
  exponentialBackoff: true,
});