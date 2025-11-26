
// Allowlist of trusted domains for redirect
const ALLOWED_DOMAINS = [
  'https://82c5feb4-6704-4122-bfd9-18a4a7de2d6b.lovableproject.com',
  'https://thesbirtechmarketplace.com',
  'https://www.thesbirtechmarketplace.com',
  'http://localhost:8080', // For local development
];

export const validateDomain = (domainParam: string | null, defaultDomain: string): string => {
  if (!domainParam) {
    return defaultDomain;
  }

  try {
    const parsedDomain = new URL(domainParam);
    const fullDomain = `${parsedDomain.protocol}//${parsedDomain.host}`;
    
    // Check if domain is in allowlist
    if (ALLOWED_DOMAINS.includes(fullDomain)) {
      console.log('✅ Domain validated and allowed:', fullDomain);
      return fullDomain;
    }
    
    console.warn('⚠️ Domain not in allowlist, using default:', fullDomain);
    return defaultDomain;
  } catch (e) {
    console.warn('⚠️ Could not parse domain parameter, using default:', domainParam, 'Error:', e);
    return defaultDomain;
  }
};
