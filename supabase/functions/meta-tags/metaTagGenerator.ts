
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
    <meta name="linkedin:card" content="summary_large_image">
    <meta name="linkedin:title" content="${metaData.title}">
    <meta name="linkedin:description" content="${longDescription}">
    <meta name="linkedin:image" content="${metaData.image}">
    
    <!-- Microsoft Teams / Office specific -->
    <meta name="msapplication-TileImage" content="${metaData.image}">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="theme-color" content="#ffffff">
    <meta name="application-name" content="SBIR Tech Marketplace">
    <meta name="ms.teams.image" content="${metaData.image}">
    <meta name="ms.teams.title" content="${metaData.title}">
    <meta name="ms.teams.description" content="${longDescription}">
    <meta name="msteams:title" content="${metaData.title}">
    <meta name="msteams:description" content="${longDescription}">
    <meta name="msteams:image" content="${metaData.image}">
    
    <!-- Additional Office/Outlook specific -->
    <meta name="office:title" content="${metaData.title}">
    <meta name="office:description" content="${longDescription}">
    <meta name="office:image" content="${metaData.image}">
    <meta name="outlook:title" content="${metaData.title}">
    <meta name="outlook:description" content="${longDescription}">
    <meta name="outlook:image" content="${metaData.image}">
    
    <!-- Additional compatibility meta tags -->
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="SBIR Tech Marketplace">
    
    <!-- Additional Open Graph tags for better LinkedIn support -->
    <meta property="og:determiner" content="the">
    <meta property="og:rich_attachment" content="true">
    <meta property="og:see_also" content="${appDomain}">
    
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
    <main role="main" itemscope itemtype="https://schema.org/TechArticle">
        <article>
            <header>
                <h1 itemprop="headline">${metaData.title}</h1>
                <p itemprop="description">${longDescription}</p>
                <meta itemprop="datePublished" content="${new Date().toISOString()}">
                <meta itemprop="dateModified" content="${new Date().toISOString()}">
                <div itemprop="author" itemscope itemtype="https://schema.org/Organization">
                    <meta itemprop="name" content="SBIR Tech Marketplace">
                    <meta itemprop="url" content="${appDomain}">
                </div>
            </header>
            
            <div>
                <img itemprop="image" src="${metaData.image}" alt="${metaData.title}" width="1200" height="630">
            </div>
            
            <footer>
                <a href="${metaData.url}" rel="canonical">View Full Listing →</a>
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
            }, 1000); // Increased delay for better crawler support
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
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'X-Robots-Tag': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      'Vary': 'User-Agent, Accept-Encoding',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${listingId}-${Date.now()}"`,
      'Accept-Ranges': 'bytes',
    },
  });
};
