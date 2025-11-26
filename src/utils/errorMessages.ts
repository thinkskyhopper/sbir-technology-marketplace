/**
 * Centralized error message sanitization utility
 * Converts technical error messages into user-friendly ones
 * while logging the original error for debugging
 */

interface ErrorPattern {
  patterns: string[];
  message: string;
}

const ERROR_MAPPINGS: ErrorPattern[] = [
  // Authentication errors
  {
    patterns: ['Invalid login credentials', 'invalid_credentials', 'invalid login'],
    message: 'Invalid email or password. Please try again.',
  },
  {
    patterns: ['Email not confirmed', 'Email link is invalid', 'confirm your email'],
    message: 'Please verify your email address before signing in. Check your inbox for a confirmation email.',
  },
  {
    patterns: ['User already registered', 'duplicate', 'already exists'],
    message: 'An account with this email already exists.',
  },
  {
    patterns: ['rate limit', 'too many'],
    message: 'Too many attempts. Please wait a few minutes and try again.',
  },
  {
    patterns: ['session_not_found', 'invalid_session', 'session has expired'],
    message: 'Your session has expired. Please sign in again.',
  },
  {
    patterns: ['same_password'],
    message: 'New password must be different from your current password.',
  },
  {
    patterns: ['User not found', 'no account found'],
    message: 'No account found with this email address.',
  },
  {
    patterns: ['invalid_request'],
    message: 'Invalid request. Please check your information and try again.',
  },
  
  // Permission errors
  {
    patterns: ['Only administrators', "don't have permission", 'Insufficient permissions'],
    message: "You don't have permission to perform this action.",
  },
  {
    patterns: ['RLS policy', 'security policy'],
    message: 'This action is not allowed due to security restrictions.',
  },
  
  // Network errors
  {
    patterns: ['network', 'fetch failed', 'connection'],
    message: 'Connection error. Please check your internet connection and try again.',
  },
  
  // Database errors (generic - don't expose internals)
  {
    patterns: ['relation', 'column', 'constraint', 'violates', 'foreign key', 'null value'],
    message: 'A database error occurred. Please try again or contact support if the issue persists.',
  },
];

/**
 * Sanitizes error messages by matching against known patterns
 * and returning user-friendly alternatives
 * 
 * @param error - The error object or message to sanitize
 * @param context - Optional context for more specific error messages
 * @returns User-friendly error message
 */
export function sanitizeErrorMessage(
  error: Error | string | unknown,
  context?: string
): string {
  // Extract error message
  let errorMessage = '';
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String((error as any).message);
  }
  
  // Log original error for debugging (server-side only in production)
  if (errorMessage) {
    console.error(`[Error Sanitizer] Original error${context ? ` (${context})` : ''}:`, errorMessage);
  }
  
  // Match against known patterns
  const lowerMessage = errorMessage.toLowerCase();
  
  for (const mapping of ERROR_MAPPINGS) {
    for (const pattern of mapping.patterns) {
      if (lowerMessage.includes(pattern.toLowerCase())) {
        return mapping.message;
      }
    }
  }
  
  // Default fallback for unknown errors
  return 'Something went wrong. Please try again or contact support if the issue persists.';
}

/**
 * Checks if an error is a specific known type
 */
export function isEmailNotConfirmedError(error: Error | string | unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();
  
  return (
    lowerMessage.includes('email not confirmed') ||
    lowerMessage.includes('email link is invalid') ||
    lowerMessage.includes('confirm your email')
  );
}

/**
 * Checks if an error is a rate limit error
 */
export function isRateLimitError(error: Error | string | unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();
  
  return lowerMessage.includes('rate limit') || lowerMessage.includes('too many');
}
