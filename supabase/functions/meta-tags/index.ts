
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const listingId = url.searchParams.get('id');
    const domainParam = url.searchParams.get('domain');

    if (!listingId) {
      return new Response('Missing listing ID', { status: 400 });
    }

    // Check if this is a social media crawler
    const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';
    const isCrawler = userAgent.includes('facebookexternalhit') || 
                     userAgent.includes('twitterbot') || 
                     userAgent.includes('linkedinbot') || 
                     userAgent.includes('slackbot') || 
                     userAgent.includes('whatsapp') ||
                     userAgent.includes('microsoftpreview') ||
                     userAgent.includes('teams') ||
                     userAgent.includes('skypeuripreview') ||
                     userAgent.includes('discordbot') ||
                     userAgent.includes('telegrambot') ||
                     userAgent.includes('googlebot') ||
                     userAgent.includes('bingbot') ||
                     userAgent.includes('applebot') ||
                     userAgent.includes('crawler') ||
                     userAgent.includes('spider') ||
                     // Check for common preview/link expansion patterns
                     userAgent.includes('preview') ||
                     userAgent.includes('linkexpander') ||
                     userAgent.includes('urlpreview');

    console.log('Request details:', {
      userAgent,
      isCrawler,
      listingId,
      domainParam
    });

    // Determine the correct app domain
    let appDomain = 'https://82c5feb4-6704-4122-bfd9-18a4a7de2d6b.lovableproject.com'; // Default fallback
    
    if (domainParam) {
      try {
        const parsedDomain = new URL(domainParam);
        appDomain = `${parsedDomain.protocol}//${parsedDomain.host}`;
        console.log('Using domain from parameter:', appDomain);
      } catch (e) {
        console.log('Could not parse domain parameter:', domainParam);
      }
    }

    const listingUrl = `${appDomain}/listing/${listingId}`;

    // For regular users (not crawlers), redirect immediately
    if (!isCrawler) {
      console.log('Regular user detected, redirecting to:', listingUrl);
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': listingUrl,
        },
      });
    }

    // For crawlers, fetch the listing data and serve meta tags
    console.log('Crawler detected, serving meta tags for:', userAgent);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the listing data
    const { data: listing, error } = await supabase
      .from('sbir_listings')
      .select('*')
      .eq('id', listingId)
      .eq('status', 'Active')
      .single();

    if (error || !listing) {
      console.log('Listing not found:', error);
      // Return default meta tags for non-existent listings
      return generateMetaTagsResponse({
        title: 'The SBIR Tech Marketplace',
        description: 'Helping generate revenue from past SBIR/STTR awards by connecting interested buyers, teaming partners and federal customers.',
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        url: listingUrl,
        type: 'website'
      }, listingId, true, appDomain);
    }

    // Convert value from cents to dollars for display
    const valueInDollars = listing.value / 100;
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valueInDollars);

    // Generate category-specific image
    const getListingImage = (category: string) => {
      const categoryLower = category.toLowerCase();
      
      if (categoryLower.includes('cyber') || categoryLower.includes('security')) {
        return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
      } else if (categoryLower.includes('software') || categoryLower.includes('ai') || categoryLower.includes('data')) {
        return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
      } else if (categoryLower.includes('hardware') || categoryLower.includes('electronic')) {
        return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
      } else if (categoryLower.includes('autonomous')) {
        return "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
      } else if (categoryLower.includes('biomedical') || categoryLower.includes('medical')) {
        return "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
      } else if (categoryLower.includes('quantum')) {
        return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
      } else if (categoryLower.includes('space')) {
        return "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
      } else if (categoryLower.includes('advanced materials') || categoryLower.includes('materials')) {
        return "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
      } else {
        return "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
      }
    };

    // Helper function to properly clean and escape text
    const cleanText = (text: string) => {
      return text
        .normalize('NFKD')
        .replace(/[\u2013\u2014]/g, '-')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2026]/g, '...')
        .replace(/[^\x00-\x7F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    // Helper function to escape HTML
    const escapeHtml = (text: string) => {
      const cleaned = cleanText(text);
      return cleaned
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    // Create shorter, more Twitter-friendly description
    const createDescription = (listing: any) => {
      const baseDescription = `${listing.phase} ${listing.category} project from ${listing.agency}. Value: ${formattedValue}.`;
      const remainingLength = 160 - baseDescription.length - 3; // Leave space for "..."
      
      if (remainingLength > 0 && listing.description) {
        const truncatedDesc = listing.description.substring(0, remainingLength);
        return escapeHtml(`${baseDescription} ${truncatedDesc}...`);
      }
      
      return escapeHtml(baseDescription);
    };

    // Create meta tag data with proper encoding and domain
    const metaData = {
      title: escapeHtml(`${listing.title} - SBIR Tech Marketplace`),
      description: createDescription(listing),
      image: getListingImage(listing.category),
      url: listingUrl,
      type: 'article'
    };

    console.log('Generated meta data:', metaData);

    return generateMetaTagsResponse(metaData, listingId, true, appDomain);

  } catch (error) {
    console.error('Error in meta-tags function:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

function generateMetaTagsResponse(metaData: any, listingId: string, isCrawler: boolean, appDomain: string) {
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
    <meta property="og:description" content="${metaData.description}">
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
    
    <!-- Microsoft Teams specific tags -->
    <meta name="msapplication-TileImage" content="${metaData.image}">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="theme-color" content="#ffffff">
    
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
      "description": "${metaData.description.replace(/"/g, '\\"')}",
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
    <a href="${metaData.url}">View listing</a>
    
    <script>
        console.log('Meta tags page served for crawler');
        console.log('Listing URL:', '${metaData.url}');
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
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'X-Robots-Tag': 'index, follow',
      'Vary': 'User-Agent',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
