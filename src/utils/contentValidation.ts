
export interface ContentValidationResult {
  isValid: boolean;
  errors: string[];
  score: number; // Spam score from 0-100
}

export const validateListingContent = (data: {
  title: string;
  description: string;
  agency: string;
  category: string;
}): ContentValidationResult => {
  const errors: string[] = [];
  let spamScore = 0;

  // Check for excessive capitalization
  const capsRatio = (data.title.match(/[A-Z]/g) || []).length / data.title.length;
  if (capsRatio > 0.5) {
    errors.push('Title contains too many capital letters');
    spamScore += 20;
  }

  // Check for repeated characters
  const repeatedChars = /(.)\1{4,}/g;
  if (repeatedChars.test(data.title) || repeatedChars.test(data.description)) {
    errors.push('Content contains excessive repeated characters');
    spamScore += 25;
  }

  // Check for suspicious URLs
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  const urls = (data.description.match(urlPattern) || []);
  if (urls.length > 2) {
    errors.push('Description contains too many URLs');
    spamScore += 30;
  }

  // Check for common spam phrases
  const spamPhrases = [
    'make money fast',
    'click here',
    'limited time offer',
    'act now',
    'guaranteed',
    'free money',
    'work from home',
    'get rich quick'
  ];
  
  const content = `${data.title} ${data.description}`.toLowerCase();
  const foundSpamPhrases = spamPhrases.filter(phrase => 
    content.includes(phrase.toLowerCase())
  );
  
  if (foundSpamPhrases.length > 0) {
    errors.push('Content contains suspicious promotional language');
    spamScore += foundSpamPhrases.length * 15;
  }

  // Check for minimum content quality
  if (data.description.length < 50) {
    errors.push('Description is too short (minimum 50 characters)');
    spamScore += 10;
  }

  // Check for excessive punctuation
  const punctuationRatio = (data.description.match(/[!?]{2,}/g) || []).length;
  if (punctuationRatio > 3) {
    errors.push('Description contains excessive punctuation');
    spamScore += 15;
  }

  return {
    isValid: errors.length === 0 && spamScore < 50,
    errors,
    score: Math.min(spamScore, 100)
  };
};

export const isValidAgency = (agency: string): boolean => {
  // List of known legitimate agencies
  const validAgencies = [
    'Department of Defense',
    'DOD',
    'Navy',
    'Air Force',
    'Army',
    'Department of Energy',
    'DOE',
    'NASA',
    'National Science Foundation',
    'NSF',
    'Department of Homeland Security',
    'DHS',
    'Department of Health and Human Services',
    'HHS',
    'National Institutes of Health',
    'NIH'
  ];

  // Check if agency name is reasonable length and format
  if (agency.length < 3 || agency.length > 100) {
    return false;
  }

  // Check if it's a known agency or follows government naming pattern
  const agencyLower = agency.toLowerCase();
  const isKnownAgency = validAgencies.some(valid => 
    agencyLower.includes(valid.toLowerCase()) || 
    valid.toLowerCase().includes(agencyLower)
  );
  
  const hasGovPattern = /\b(department|agency|bureau|office|administration|institute)\b/i.test(agency);
  
  return isKnownAgency || hasGovPattern;
};
