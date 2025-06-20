
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

    if (!listingId) {
      return new Response('Missing listing ID', { status: 400 });
    }

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
        image: 'https://amhznlnhrrugxatbeayo.supabase.co/storage/v1/object/public/uploads/f964523f-f4e2-493f-94a1-a80c35e6a6f4.png',
        url: `https://amhznlnhrrugxatbeayo.supabase.co/meta-tags?id=${listingId}`,
        type: 'website'
      }, listingId);
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

    // Create meta tag data
    const metaData = {
      title: `${listing.title} - SBIR Tech Marketplace`,
      description: `${listing.phase} ${listing.category} project from ${listing.agency}. Value: ${formattedValue}. ${listing.description.substring(0, 150)}...`,
      image: getListingImage(listing.category),
      url: `https://your-domain.com/listing/${listing.id}`, // Replace with your actual domain
      type: 'article'
    };

    return generateMetaTagsResponse(metaData, listingId);

  } catch (error) {
    console.error('Error in meta-tags function:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

function generateMetaTagsResponse(metaData: any, listingId: string) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaData.title}</title>
    
    <!-- Basic Meta Tags -->
    <meta name="description" content="${metaData.description}">
    
    <!-- Open Graph Meta Tags for LinkedIn, Facebook, etc. -->
    <meta property="og:title" content="${metaData.title}">
    <meta property="og:description" content="${metaData.description}">
    <meta property="og:image" content="${metaData.image}">
    <meta property="og:url" content="${metaData.url}">
    <meta property="og:type" content="${metaData.type}">
    <meta property="og:site_name" content="SBIR Tech Marketplace">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${metaData.title}">
    <meta name="twitter:description" content="${metaData.description}">
    <meta name="twitter:image" content="${metaData.image}">
    
    <!-- LinkedIn specific optimization -->
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    <!-- Redirect to the actual listing page -->
    <meta http-equiv="refresh" content="0; url=https://your-domain.com/listing/${listingId}">
    
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
    </style>
</head>
<body>
    <div class="container">
        <h1>SBIR Tech Marketplace</h1>
        <div class="spinner"></div>
        <p>Redirecting you to the listing...</p>
        <p>If you're not redirected automatically, <a href="https://your-domain.com/listing/${listingId}">click here</a>.</p>
    </div>
    
    <script>
        // Fallback redirect in case meta refresh doesn't work
        setTimeout(function() {
            window.location.href = 'https://your-domain.com/listing/${listingId}';
        }, 1000);
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
    },
  });
}
