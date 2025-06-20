
export const isCrawler = (userAgent: string): boolean => {
  const ua = userAgent.toLowerCase();
  return ua.includes('facebookexternalhit') || 
         ua.includes('twitterbot') || 
         ua.includes('linkedinbot') || 
         ua.includes('slackbot') || 
         ua.includes('whatsapp') ||
         ua.includes('microsoftpreview') ||
         ua.includes('teams') ||
         ua.includes('msteams') ||
         ua.includes('skypeuripreview') ||
         ua.includes('skype') ||
         ua.includes('outlook') ||
         ua.includes('office') ||
         ua.includes('discordbot') ||
         ua.includes('telegrambot') ||
         ua.includes('googlebot') ||
         ua.includes('bingbot') ||
         ua.includes('applebot') ||
         ua.includes('crawler') ||
         ua.includes('spider') ||
         ua.includes('preview') ||
         ua.includes('linkexpander') ||
         ua.includes('urlpreview') ||
         ua.includes('bot') ||
         ua.includes('scraper') ||
         ua.includes('validator') ||
         ua.includes('fetcher') ||
         ua.includes('embed') ||
         ua.includes('preview') ||
         ua.includes('card') ||
         ua.includes('parser') ||
         ua.includes('babylonia') || // LinkedIn's ingestion service
         ua.includes('linkedinsharevalidator') ||
         ua.includes('linkedin') ||
         ua.includes('microsoft') ||
         ua.includes('graph.microsoft.com');
};

// Specific function to detect platform type for optimized responses
export const getPlatformType = (userAgent: string): 'twitter' | 'linkedin' | 'teams' | 'facebook' | 'other' => {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('twitterbot')) return 'twitter';
  if (ua.includes('linkedinbot') || ua.includes('babylonia') || ua.includes('linkedinsharevalidator') || ua.includes('linkedin')) return 'linkedin';
  if (ua.includes('teams') || ua.includes('msteams') || ua.includes('microsoftpreview') || ua.includes('skype') || ua.includes('outlook') || ua.includes('office') || ua.includes('microsoft')) return 'teams';
  if (ua.includes('facebookexternalhit')) return 'facebook';
  
  return 'other';
};
