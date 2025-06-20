
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
         ua.includes('parser');
};

// Specific function to detect platform type for optimized responses
export const getPlatformType = (userAgent: string): 'twitter' | 'linkedin' | 'teams' | 'facebook' | 'other' => {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('twitterbot')) return 'twitter';
  if (ua.includes('linkedinbot')) return 'linkedin';
  if (ua.includes('teams') || ua.includes('msteams') || ua.includes('microsoftpreview') || ua.includes('skype') || ua.includes('outlook') || ua.includes('office')) return 'teams';
  if (ua.includes('facebookexternalhit')) return 'facebook';
  
  return 'other';
};
