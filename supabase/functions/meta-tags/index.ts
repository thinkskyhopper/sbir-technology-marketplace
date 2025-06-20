
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
                     userAgent.includes('bot') ||
                     userAgent.includes('crawler');

    console.log('Request details:', {
      userAgent,
      isCrawler,
      listingId,
      domainParam,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine the correct app domain
    let appDomain = 'https://amhznlnhrrugxatbeayo.supabase.co'; // Default fallback
    
    // First priority: use the domain parameter passed from the ShareButton
    if (domainParam) {
      try {
        const parsedDomain = new URL(domainParam);
        appDomain = `${parsedDomain.protocol}//${parsedDomain.host}`;
        console.log('Using domain from parameter:', appDomain);
      } catch (e) {
        console.log('Could not parse domain parameter:', domainParam);
      }
    } else {
      // Fallback: try to get from referrer if it's not the edge function domain
      const referrer = req.headers.get('referer');
      if (referrer) {
        try {
          const referrerUrl = new URL(referrer);
          if (!referrerUrl.host.includes('functions') && !referrerUrl.host.includes('supabase.co')) {
            appDomain = `${referrerUrl.protocol}//${referrerUrl.host}`;
            console.log('Using domain from referrer:', appDomain);
          }
        } catch (e) {
          console.log('Could not parse referrer:', referrer);
        }
      }
    }

    console.log('Final app domain:', appDomain);

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
        image: 'https://amhznlnhrrugxatbeayo.supabase.co/storage/v1/object/public/uploads/f964523f-f4e2-493f-94a1-a80c35e6a6f4.png',
        url: `${appDomain}/listing/${listingId}`,
        type: 'website'
      }, listingId, isCrawler, appDomain);
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
        // First normalize Unicode characters
        .normalize('NFKD')
        // Replace problematic characters with proper ones
        .replace(/[\u2013\u2014]/g, '-') // em dash and en dash
        .replace(/[\u2018\u2019]/g, "'") // smart quotes
        .replace(/[\u201C\u201D]/g, '"') // smart double quotes
        .replace(/[\u2026]/g, '...') // ellipsis
        // Remove any remaining non-ASCII characters that might cause issues
        .replace(/[^\x00-\x7F]/g, ' ')
        // Clean up multiple spaces
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

    // Create meta tag data with proper encoding and domain
    const metaData = {
      title: escapeHtml(`${listing.title} - SBIR Tech Marketplace`),
      description: escapeHtml(`${listing.phase} ${listing.category} project from ${listing.agency}. Value: ${formattedValue}. ${listing.description.substring(0, 150)}...`),
      image: getListingImage(listing.category),
      url: `${appDomain}/listing/${listing.id}`,
      type: 'article'
    };

    return generateMetaTagsResponse(metaData, listingId, isCrawler, appDomain);

  } catch (error) {
    console.error('Error in meta-tags function:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

function generateMetaTagsResponse(metaData: any, listingId: string, isCrawler: boolean, appDomain: string) {
  // For crawlers, delay redirect longer and add more meta tags
  const redirectDelay = isCrawler ? 5000 : 2000;
  
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
    
    <!-- LinkedIn specific tags -->
    <meta property="og:image:alt" content="${metaData.title}">
    
    <!-- Microsoft Teams specific tags -->
    <meta name="msapplication-TileImage" content="${metaData.image}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${metaData.url}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${metaData.title.replace(/"/g, '\\"')}",
      "description": "${metaData.description.replace(/"/g, '\\"')}",
      "image": "${metaData.image}",
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
          "url": "https://amhznlnhrrugxatbeayo.supabase.co/storage/v1/object/public/uploads/f964523f-f4e2-493f-94a1-a80c35e6a6f4.png"
        }
      }
    }
    </script>
    
    <!-- Redirect to the actual listing page after delay -->
    <meta http-equiv="refresh" content="${redirectDelay / 1000}; url=${metaData.url}">
    
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .debug-info {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 10px;
            margin: 20px 0;
            font-size: 12px;
            text-align: left;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SBIR Tech Marketplace</h1>
        <div class="spinner"></div>
        <p>Loading listing details...</p>
        <p>You will be redirected automatically in ${redirectDelay / 1000} seconds.</p>
        
        ${isCrawler ? `
        <div class="debug-info">
            <strong>Debug Info:</strong><br>
            Title: ${metaData.title}<br>
            Description: ${metaData.description.substring(0, 100)}...<br>
            Image: ${metaData.image}<br>
            Crawler detected: ${isCrawler}<br>
            App Domain: ${appDomain}<br>
            Redirect URL: ${metaData.url}
        </div>
        ` : ''}
        
        <p>If you're not redirected automatically, <a href="${metaData.url}">click here</a>.</p>
    </div>
    
    <script>
        // Log for debugging
        console.log('Meta tags page loaded for listing: ${listingId}');
        console.log('User agent:', navigator.userAgent);
        console.log('Is crawler:', ${isCrawler});
        console.log('App domain:', '${appDomain}');
        console.log('Redirect URL:', '${metaData.url}');
        
        // Fallback redirect in case meta refresh doesn't work
        setTimeout(function() {
            if (window.location.href.includes('meta-tags')) {
                window.location.href = '${metaData.url}';
            }
        }, ${redirectDelay});
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'X-Robots-Tag': 'index, follow',
      // Additional headers for better crawler support
      'Vary': 'User-Agent',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
