export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordStrength {
  score: number;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

// Sanitize name fields - allow only letters, spaces, hyphens, apostrophes
export const sanitizeName = (name: string): string => {
  return name
    .replace(/[^a-zA-Z\s\-']/g, '') // Remove invalid characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim() // Remove leading/trailing whitespace
    .slice(0, 50); // Enforce max length
};

// Validate name fields
export const validateName = (name: string, fieldName: string): ValidationResult => {
  const sanitized = sanitizeName(name);
  
  if (!sanitized) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }
  
  if (!/^[a-zA-Z\s\-']+$/.test(sanitized)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { isValid: true };
};

// Check password strength
export const checkPasswordStrength = (password: string): PasswordStrength => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return { score, checks };
};

// Validate password
export const validatePassword = (password: string): ValidationResult => {
  const strength = checkPasswordStrength(password);
  
  if (!strength.checks.length) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  
  if (!strength.checks.uppercase) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!strength.checks.lowercase) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!strength.checks.number) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  if (!strength.checks.special) {
    return { isValid: false, error: 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)' };
  }
  
  return { isValid: true };
};

// Validate password confirmation
export const validatePasswordConfirmation = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true };
};

// Sanitize general text input
export const sanitizeText = (text: string): string => {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove < and > characters
    .trim();
};

// Enhanced email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};