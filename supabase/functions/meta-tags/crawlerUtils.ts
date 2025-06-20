
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
         ua.includes('fetcher');
};
