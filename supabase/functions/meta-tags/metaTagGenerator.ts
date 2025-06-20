
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
  // Create a longer description for certain platforms
  const longDescription = listing ? createLongDescription(listing) : metaData.description;
  
  // Add cache busting parameter to image URL
  const imageUrlWithCacheBust = `${metaData.image}&cb=${Date.now()}`;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaData.title}</title>
    
    <!-- Basic Meta Tags -->
    <meta name="description" content="${metaData.description}">
    <meta name="author" content="SBIR Tech Marketplace">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph Meta Tags for LinkedIn, Facebook, etc. -->
    <meta property="og:title" content="${metaData.title}">
    <meta property="og:description" content="${longDescription}">
    <meta property="og:image" content="${metaData.image}">
    <meta property="og:image:url" content="${metaData.image}">
    <meta property="og:image:secure_url" content="${metaData.image}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${metaData.title}">
    <meta property="og:url" content="${metaData.url}">
    <meta property="og:type" content="${metaData.type}">
    <meta property="og:site_name" content="SBIR Tech Marketplace">
    <meta property="og:locale" content="en_US">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@sbirtech">
    <meta name="twitter:creator" content="@sbirtech">
    <meta name="twitter:title" content="${metaData.title}">
    <meta name="twitter:description" content="${metaData.description}">
    <meta name="twitter:image" content="${metaData.image}">
    <meta name="twitter:image:src" content="${metaData.image}">
    <meta name="twitter:image:width" content="1200">
    <meta name="twitter:image:height" content="630">
    <meta name="twitter:image:alt" content="${metaData.title}">
    
    <!-- Microsoft Teams and Skype specific tags -->
    <meta property="msteams:card" content="summary_large_image">
    <meta property="msteams:title" content="${metaData.title}">
    <meta property="msteams:description" content="${longDescription}">
    <meta property="msteams:image" content="${metaData.image}">
    <meta name="msapplication-TileImage" content="${metaData.image}">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="theme-color" content="#ffffff">
    
    <!-- LinkedIn specific tags -->
    <meta property="linkedin:title" content="${metaData.title}">
    <meta property="linkedin:description" content="${longDescription}">
    <meta property="linkedin:image" content="${metaData.image}">
    
    <!-- WhatsApp and general sharing -->
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/jpeg">
    
    <!-- Additional meta tags for better compatibility -->
    <meta property="article:author" content="SBIR Tech Marketplace">
    <meta property="article:publisher" content="SBIR Tech Marketplace">
    <meta name="application-name" content="SBIR Tech Marketplace">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${metaData.url}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${metaData.title.replace(/"/g, '\\"')}",
      "description": "${longDescription.replace(/"/g, '\\"')}",
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
          "url": "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        }
      }
    }
    </script>
</head>
<body>
    <h1>${metaData.title}</h1>
    <p>${metaData.description}</p>
    <img src="${metaData.image}" alt="${metaData.title}" style="max-width: 100%; height: auto;">
    <a href="${metaData.url}">View listing</a>
    
    <script>
        console.log('Meta tags page served for crawler');
        console.log('Listing URL:', '${metaData.url}');
        console.log('Image URL:', '${metaData.image}');
        // Immediate redirect for any non-crawler that somehow reaches this page
        if (!navigator.userAgent.toLowerCase().includes('bot') && 
            !navigator.userAgent.toLowerCase().includes('crawler') &&
            !navigator.userAgent.toLowerCase().includes('preview')) {
            window.location.href = '${metaData.url}';
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
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${listingId}-${Date.now()}"`,
    },
  });
};
