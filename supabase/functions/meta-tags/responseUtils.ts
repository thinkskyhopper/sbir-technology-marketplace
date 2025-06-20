
export const createResponseHeaders = (corsHeaders: Record<string, string>, listingId: string): Record<string, string> => {
  return {
    ...corsHeaders,
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=300, s-maxage=300',
    'X-Robots-Tag': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    'Vary': 'User-Agent, Accept-Encoding',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `"${listingId}-${Date.now()}"`,
    'Accept-Ranges': 'bytes',
  };
};
