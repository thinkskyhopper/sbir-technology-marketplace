
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isCrawler } from './crawlerUtils.ts';
import { getListingImage } from './imageUtils.ts';
import { escapeHtml } from './textUtils.ts';
import { createDescription } from './descriptionUtils.ts';
import { generateMetaTagsResponse } from './metaTagGenerator.ts';
import type { MetaData, Listing } from './types.ts';

export const handleRequest = async (req: Request, corsHeaders: Record<string, string>) => {
  const url = new URL(req.url);
  const listingId = url.searchParams.get('id');
  const domainParam = url.searchParams.get('domain');

  if (!listingId) {
    return new Response('Missing listing ID', { status: 400 });
  }

  // Get user agent and check if it's a crawler
  const userAgent = req.headers.get('user-agent') || '';
  const isUserAgentCrawler = isCrawler(userAgent);

  console.log('=== META TAGS REQUEST ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('User Agent:', userAgent);
  console.log('Is Crawler:', isUserAgentCrawler);
  console.log('Listing ID:', listingId);
  console.log('Domain Param:', domainParam);
  console.log('Request URL:', req.url);

  // Determine the correct app domain
  let appDomain = 'https://82c5feb4-6704-4122-bfd9-18a4a7de2d6b.lovableproject.com'; // Default fallback
  
  if (domainParam) {
    try {
      const parsedDomain = new URL(domainParam);
      appDomain = `${parsedDomain.protocol}//${parsedDomain.host}`;
      console.log('Using domain from parameter:', appDomain);
    } catch (e) {
      console.log('Could not parse domain parameter:', domainParam, 'Error:', e);
    }
  }

  const listingUrl = `${appDomain}/listing/${listingId}`;
  console.log('Target listing URL:', listingUrl);

  // For regular users (not crawlers), redirect immediately
  if (!isUserAgentCrawler) {
    console.log('=== REDIRECTING USER ===');
    console.log('Redirecting to:', listingUrl);
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': listingUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  // For crawlers, fetch the listing data and serve meta tags
  console.log('=== SERVING META TAGS FOR CRAWLER ===');
  console.log('Crawler type detected:', userAgent);

  // Initialize Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Fetching listing from database...');

  // Fetch the listing data
  const { data: listing, error } = await supabase
    .from('sbir_listings')
    .select('*')
    .eq('id', listingId)
    .eq('status', 'Active')
    .single();

  if (error || !listing) {
    console.log('=== LISTING NOT FOUND ===');
    console.log('Error:', error);
    console.log('Listing data:', listing);
    
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

  console.log('=== LISTING FOUND ===');
  console.log('Listing title:', listing.title);
  console.log('Listing category:', listing.category);
  console.log('Listing agency:', listing.agency);
  console.log('Listing phase:', listing.phase);
  console.log('Listing value:', listing.value);

  // Get the image URL and log it for debugging
  const imageUrl = getListingImage(listing.category);
  console.log('Selected image URL for category', listing.category, ':', imageUrl);

  // Create meta tag data with proper encoding and domain
  const metaData: MetaData = {
    title: escapeHtml(`${listing.title} - SBIR Tech Marketplace`),
    description: createDescription(listing as Listing),
    image: imageUrl,
    url: listingUrl,
    type: 'article'
  };

  console.log('=== FINAL META DATA ===');
  console.log('Title:', metaData.title);
  console.log('Description:', metaData.description);
  console.log('Image:', metaData.image);
  console.log('URL:', metaData.url);
  console.log('Type:', metaData.type);

  // Pass the full listing data to generate better descriptions for different platforms
  return generateMetaTagsResponse(metaData, listingId, true, appDomain, corsHeaders, listing);
};
