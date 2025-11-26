
// UUID v4 validation
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isValidUUID = (uuid: string): boolean => {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }
  return UUID_V4_REGEX.test(uuid);
};

export const validateUUID = (uuid: string, fieldName: string = 'ID'): { isValid: boolean; error?: string } => {
  if (!uuid) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (!isValidUUID(uuid)) {
    return { isValid: false, error: `Invalid ${fieldName} format` };
  }

  return { isValid: true };
};
