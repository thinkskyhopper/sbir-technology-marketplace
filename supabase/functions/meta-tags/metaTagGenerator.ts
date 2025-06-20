
import type { MetaData } from './types.ts';
import { createLongDescription } from './descriptionUtils.ts';
import { getPlatformType } from './crawlerUtils.ts';

export const generateMetaTagsResponse = (
  metaData: MetaData, 
  listingId: string, 
  isCrawler: boolean, 
  appDomain: string,
  corsHeaders: Record<string, string>,
  listing?: any
): Response => {
  // Get platform-specific optimized descriptions
  const shortDescription = metaData.description;
  const longDescription = listing ? createLongDescription(listing) : metaData.description;
  
  console.log('Generating meta tags for listing:', listingId);
  console.log('Meta data being used:', JSON.stringify(metaData, null, 2));
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${metaData.title}</title>
    <meta name="title" content="${metaData.title}">
    <meta name="description" content="${shortDescription}">
    <meta name="author" content="SBIR Tech Marketplace">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    
    <!-- Open Graph / Facebook & LinkedIn -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="SBIR Tech Marketplace">
    <meta property="og:title" content="${metaData.title}">
    <meta property="og:description" content="${longDescription}">
    <meta property="og:url" content="${metaData.url}">
    <meta property="og:image" content="${metaData.image}">
    <meta property="og:image:secure_url" content="${metaData.image}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${metaData.title}">
    <meta property="og:locale" content="en_US">
    <meta property="article:author" content="SBIR Tech Marketplace">
    <meta property="article:publisher" content="SBIR Tech Marketplace">
    <meta property="article:published_time" content="${new Date().toISOString()}">
    <meta property="article:modified_time" content="${new Date().toISOString()}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@sbirtech">
    <meta name="twitter:creator" content="@sbirtech">
    <meta name="twitter:title" content="${metaData.title}">
    <meta name="twitter:description" content="${shortDescription}">
    <meta name="twitter:url" content="${metaData.url}">
    <meta name="twitter:image" content="${metaData.image}">
    <meta name="twitter:image:src" content="${metaData.image}">
    <meta name="twitter:image:alt" content="${metaData.title}">
    <meta name="twitter:image:width" content="1200">
    <meta name="twitter:image:height" content="630">
    
    <!-- LinkedIn specific tags -->
    <meta property="linkedin:owner" content="SBIR Tech Marketplace">
    
    <!-- Microsoft Teams / Office specific -->
    <meta name="msapplication-TileImage" content="${metaData.image}">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="theme-color" content="#ffffff">
    <meta name="application-name" content="SBIR Tech Marketplace">
    <meta name="ms.teams.image" content="${metaData.image}">
    <meta name="ms.teams.title" content="${metaData.title}">
    <meta name="ms.teams.description" content="${longDescription}">
    
    <!-- Additional compatibility meta tags -->
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="SBIR Tech Marketplace">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${metaData.url}">
    
    <!-- Favicon and icons -->
    <link rel="icon" type="image/x-icon" href="${appDomain}/favicon.ico">
    <link rel="shortcut icon" href="${appDomain}/favicon.ico">
    <link rel="apple-touch-icon" href="${metaData.image}">
    
    <!-- Structured Data for better SEO and social sharing -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "${metaData.title.replace(/"/g, '\\"')}",
      "description": "${longDescription.replace(/"/g, '\\"')}",
      "image": {
        "@type": "ImageObject",
        "url": "${metaData.image}",
        "width": 1200,
        "height": 630,
        "caption": "${metaData.title.replace(/"/g, '\\"')}"
      },
      "url": "${metaData.url}",
      "datePublished": "${new Date().toISOString()}",
      "dateModified": "${new Date().toISOString()}",
      "author": {
        "@type": "Organization",
        "name": "SBIR Tech Marketplace",
        "url": "${appDomain}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SBIR Tech Marketplace",
        "url": "${appDomain}",
        "logo": {
          "@type": "ImageObject",
          "url": "${metaData.image}",
          "width": 1200,
          "height": 630
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${metaData.url}"
      }
    }
    </script>
</head>
<body>
    <!-- Enhanced content for crawlers and humans -->
    <main style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <article style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <header style="margin-bottom: 30px;">
                <h1 style="color: #1a202c; margin: 0 0 16px 0; font-size: 32px; font-weight: 700; line-height: 1.2;">${metaData.title}</h1>
                <p style="color: #4a5568; font-size: 18px; line-height: 1.6; margin: 0;">${longDescription}</p>
            </header>
            
            <div style="margin-bottom: 30px;">
                <img src="${metaData.image}" alt="${metaData.title}" style="width: 100%; max-width: 800px; height: auto; border-radius: 10px; display: block; margin: 0 auto;">
            </div>
            
            <footer style="text-align: center; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                <a href="${metaData.url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                    View Full Listing →
                </a>
            </footer>
        </article>
    </main>
    
    <script>
        // Enhanced crawler detection with better platform recognition
        const userAgent = navigator.userAgent.toLowerCase();
        
        const crawlerPatterns = [
            'bot', 'crawler', 'spider', 'preview', 'teams', 'msteams', 'skype', 'outlook', 
            'office', 'facebookexternalhit', 'twitterbot', 'linkedinbot', 'microsoftpreview',
            'validator', 'fetcher', 'embed', 'parser', 'card'
        ];
        
        const isCrawlerClient = crawlerPatterns.some(pattern => userAgent.includes(pattern));
        
        console.log('Enhanced User Agent Check:', navigator.userAgent);
        console.log('Is Crawler (Enhanced):', isCrawlerClient);
        console.log('Document Title:', document.title);
        console.log('Meta Description:', document.querySelector('meta[name="description"]')?.getAttribute('content'));
        console.log('OG Title:', document.querySelector('meta[property="og:title"]')?.getAttribute('content'));
        console.log('OG Description:', document.querySelector('meta[property="og:description"]')?.getAttribute('content'));
        console.log('OG Image:', document.querySelector('meta[property="og:image"]')?.getAttribute('content'));
        
        // Only redirect human users after a longer delay to ensure crawlers have time to read
        if (!isCrawlerClient) {
            console.log('Human user detected, redirecting after delay to:', '${metaData.url}');
            setTimeout(() => {
                window.location.href = '${metaData.url}';
            }, 500); // Increased delay for better crawler support
        } else {
            console.log('Crawler detected, serving static preview page');
            // For crawlers, ensure the page is fully rendered
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM fully loaded for crawler');
            });
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
      'X-Robots-Tag': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      'Vary': 'User-Agent, Accept-Encoding',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-UA-Compatible': 'IE=edge',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${listingId}-${Date.now()}"`,
      'Accept-Ranges': 'bytes',
    },
  });
};
