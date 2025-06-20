
export const createResponseHeaders = (corsHeaders: Record<string, string>, listingId: string): Record<string, string> => {
  return {
    ...corsHeaders,
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=300, s-maxage=300', // Allow 5 min caching for social crawlers
    'Vary': 'User-Agent',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Robots-Tag': 'index, follow, max-image-preview:large',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `"${listingId}-${Math.floor(Date.now() / 300000)}"`, // ETag changes every 5 minutes
    'Accept-Ranges': 'bytes',
  };
};
