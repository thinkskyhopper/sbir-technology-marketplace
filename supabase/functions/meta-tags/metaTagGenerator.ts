
import type { MetaData } from './types.ts';
import { createLongDescription } from './descriptionUtils.ts';

export const generateMetaTagsResponse = (
  metaData: MetaData, 
  listingId: string, 
  isCrawler: boolean, 
  appDomain: string,
  corsHeaders: Record<string, string>,
  listing?: any
): Response => {
  // Use the base description for Twitter to ensure it's not too long
  const twitterDescription = metaData.description;
  // Use longer description for other platforms
  const longDescription = listing ? createLongDescription(listing) : metaData.description;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaData.title}</title>
    
    <!-- Basic Meta Tags -->
    <meta name="description" content="${twitterDescription}">
    <meta name="author" content="SBIR Tech Marketplace">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph Meta Tags (Primary for most platforms) -->
    <meta property="og:type" content="${metaData.type}">
    <meta property="og:title" content="${metaData.title}">
    <meta property="og:description" content="${longDescription}">
    <meta property="og:url" content="${metaData.url}">
    <meta property="og:site_name" content="SBIR Tech Marketplace">
    <meta property="og:locale" content="en_US">
    
    <!-- Image Meta Tags -->
    <meta property="og:image" content="${metaData.image}">
    <meta property="og:image:url" content="${metaData.image}">
    <meta property="og:image:secure_url" content="${metaData.image}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${metaData.title}">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@sbirtech">
    <meta name="twitter:creator" content="@sbirtech">
    <meta name="twitter:title" content="${metaData.title}">
    <meta name="twitter:description" content="${twitterDescription}">
    <meta name="twitter:image" content="${metaData.image}">
    <meta name="twitter:image:alt" content="${metaData.title}">
    
    <!-- Microsoft Teams and Office specific tags -->
    <meta name="msapplication-TileImage" content="${metaData.image}">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="theme-color" content="#ffffff">
    
    <!-- Additional compatibility tags -->
    <meta property="article:author" content="SBIR Tech Marketplace">
    <meta property="article:publisher" content="SBIR Tech Marketplace">
    <meta name="application-name" content="SBIR Tech Marketplace">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${metaData.url}">
    
    <!-- Favicon for better recognition -->
    <link rel="icon" type="image/x-icon" href="${appDomain}/favicon.ico">
    
    <!-- Structured Data for enhanced crawling -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${metaData.title.replace(/"/g, '\\"')}",
      "description": "${twitterDescription.replace(/"/g, '\\"')}",
      "image": {
        "@type": "ImageObject",
        "url": "${metaData.image}",
        "width": 1200,
        "height": 630
      },
      "url": "${metaData.url}",
      "author": {
        "@type": "Organization",
        "name": "SBIR Tech Marketplace"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SBIR Tech Marketplace",
        "logo": {
          "@type": "ImageObject",
          "url": "${metaData.image}"
        }
      },
      "datePublished": "${new Date().toISOString()}",
      "dateModified": "${new Date().toISOString()}"
    }
    </script>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; margin-bottom: 20px;">${metaData.title}</h1>
        <img src="${metaData.image}" alt="${metaData.title}" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin-bottom: 20px;">
        <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">${twitterDescription}</p>
        <a href="${metaData.url}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Full Listing</a>
    </div>
    
    <script>
        console.log('Meta tags page loaded for:', '${metaData.url}');
        console.log('User Agent:', navigator.userAgent);
        
        // Enhanced crawler detection
        const userAgent = navigator.userAgent.toLowerCase();
        const isCrawlerClient = userAgent.includes('bot') || 
                               userAgent.includes('crawler') ||
                               userAgent.includes('spider') ||
                               userAgent.includes('preview') ||
                               userAgent.includes('teams') ||
                               userAgent.includes('msteams') ||
                               userAgent.includes('skype') ||
                               userAgent.includes('outlook') ||
                               userAgent.includes('office');
        
        // Only redirect actual users, not crawlers
        if (!isCrawlerClient) {
            console.log('Redirecting user to:', '${metaData.url}');
            window.location.href = '${metaData.url}';
        } else {
            console.log('Crawler detected, serving meta page');
        }
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Robots-Tag': 'index, follow',
      'Vary': 'User-Agent',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${listingId}-${Date.now()}"`,
    },
  });
};
