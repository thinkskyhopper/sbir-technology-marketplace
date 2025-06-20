
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isCrawler } from './crawlerUtils.ts';
import { getListingImage } from './imageUtils.ts';
import { escapeHtml } from './textUtils.ts';
import { createDescription } from './descriptionUtils.ts';
import { generateMetaTagsResponse } from './metaTagGenerator.ts';
import type { MetaData, Listing } from './types.ts';

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
    const isUserAgentCrawler = isCrawler(userAgent);

    console.log('Request details:', {
      userAgent,
      isCrawler: isUserAgentCrawler,
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
    if (!isUserAgentCrawler) {
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
      const defaultMetaData: MetaData = {
        title: 'The SBIR Tech Marketplace',
        description: 'Helping generate revenue from past SBIR/STTR awards by connecting interested buyers, teaming partners and federal customers.',
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        url: listingUrl,
        type: 'website'
      };
      return generateMetaTagsResponse(defaultMetaData, listingId, true, appDomain, corsHeaders);
    }

    // Create meta tag data with proper encoding and domain
    const metaData: MetaData = {
      title: escapeHtml(`${listing.title} - SBIR Tech Marketplace`),
      description: createDescription(listing as Listing),
      image: getListingImage(listing.category),
      url: listingUrl,
      type: 'article'
    };

    console.log('Generated meta data:', metaData);

    return generateMetaTagsResponse(metaData, listingId, true, appDomain, corsHeaders);

  } catch (error) {
    console.error('Error in meta-tags function:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});
