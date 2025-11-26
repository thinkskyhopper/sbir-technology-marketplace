
// Shared email validation utility
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_EMAIL_LENGTH = 255;

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return { isValid: false, error: `Email must be less than ${MAX_EMAIL_LENGTH} characters` };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
};
