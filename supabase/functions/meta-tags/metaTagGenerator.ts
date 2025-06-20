
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
  // Use optimized descriptions for different platforms
  const shortDescription = metaData.description;
  const longDescription = listing ? createLongDescription(listing) : metaData.description;
  
  // Debug the user agent to understand what's calling
  console.log('Generating meta tags for listing:', listingId);
  console.log('Meta data being used:', JSON.stringify(metaData, null, 2));
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Title -->
    <title>${metaData.title}</title>
    
    <!-- Primary Meta Tags -->
    <meta name="title" content="${metaData.title}">
    <meta name="description" content="${shortDescription}">
    <meta name="author" content="SBIR Tech Marketplace">
    <meta name="robots" content="index, follow, max-image-preview:large">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${metaData.url}">
    <meta property="og:title" content="${metaData.title}">
    <meta property="og:description" content="${longDescription}">
    <meta property="og:image" content="${metaData.image}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${metaData.title}">
    <meta property="og:site_name" content="SBIR Tech Marketplace">
    <meta property="og:locale" content="en_US">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${metaData.url}">
    <meta property="twitter:title" content="${metaData.title}">
    <meta property="twitter:description" content="${shortDescription}">
    <meta property="twitter:image" content="${metaData.image}">
    <meta property="twitter:image:alt" content="${metaData.title}">
    <meta property="twitter:site" content="@sbirtech">
    <meta property="twitter:creator" content="@sbirtech">
    
    <!-- Microsoft Teams / Office specific -->
    <meta name="msapplication-TileImage" content="${metaData.image}">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="theme-color" content="#ffffff">
    <meta name="application-name" content="SBIR Tech Marketplace">
    
    <!-- Additional meta tags for broader compatibility -->
    <meta property="article:author" content="SBIR Tech Marketplace">
    <meta property="article:publisher" content="SBIR Tech Marketplace">
    <meta property="article:published_time" content="${new Date().toISOString()}">
    <meta property="article:modified_time" content="${new Date().toISOString()}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${metaData.url}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="${appDomain}/favicon.ico">
    <link rel="shortcut icon" href="${appDomain}/favicon.ico">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${metaData.title.replace(/"/g, '\\"')}",
      "description": "${shortDescription.replace(/"/g, '\\"')}",
      "image": {
        "@type": "ImageObject",
        "url": "${metaData.image}",
        "width": 1200,
        "height": 630
      },
      "url": "${metaData.url}",
      "datePublished": "${new Date().toISOString()}",
      "dateModified": "${new Date().toISOString()}",
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
      }
    }
    </script>
    
    <!-- Debug information (will be removed in production) -->
    <script>
        console.log('Meta tags loaded for:', '${metaData.url}');
        console.log('Title:', '${metaData.title}');
        console.log('Description:', '${shortDescription}');
        console.log('Image:', '${metaData.image}');
    </script>
</head>
<body>
    <!-- Content for human visitors -->
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #333; margin-bottom: 20px; font-size: 28px;">${metaData.title}</h1>
            <img src="${metaData.image}" alt="${metaData.title}" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin-bottom: 20px; display: block;">
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">${shortDescription}</p>
            <a href="${metaData.url}" style="display: inline-block; background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">View Full Listing →</a>
        </div>
    </div>
    
    <script>
        // Enhanced bot detection
        const userAgent = navigator.userAgent.toLowerCase();
        const isBotClient = userAgent.includes('bot') || 
                           userAgent.includes('crawler') ||
                           userAgent.includes('spider') ||
                           userAgent.includes('preview') ||
                           userAgent.includes('teams') ||
                           userAgent.includes('msteams') ||
                           userAgent.includes('skype') ||
                           userAgent.includes('outlook') ||
                           userAgent.includes('office') ||
                           userAgent.includes('facebookexternalhit') ||
                           userAgent.includes('twitterbot') ||
                           userAgent.includes('linkedinbot');
        
        console.log('User Agent:', navigator.userAgent);
        console.log('Is Bot:', isBotClient);
        
        // Only redirect human users, not bots/crawlers
        if (!isBotClient) {
            console.log('Human user detected, redirecting to:', '${metaData.url}');
            setTimeout(() => {
                window.location.href = '${metaData.url}';
            }, 100);
        } else {
            console.log('Bot/crawler detected, serving preview page');
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
      'X-Robots-Tag': 'index, follow, max-image-preview:large',
      'Vary': 'User-Agent',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${listingId}-${Date.now()}"`,
    },
  });
};
