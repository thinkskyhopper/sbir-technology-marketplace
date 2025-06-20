
export const createResponseHeaders = (corsHeaders: Record<string, string>, listingId: string): Record<string, string> => {
  return {
    ...corsHeaders,
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate', // Disable caching to ensure fresh content
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Robots-Tag': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    'Vary': 'User-Agent, Accept-Encoding',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `"${listingId}-${Date.now()}"`,
    'Accept-Ranges': 'bytes',
    'X-UA-Compatible': 'IE=edge',
  };
};
