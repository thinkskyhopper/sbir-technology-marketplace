
import type { MetaData } from './types.ts';
import { createLongDescription } from './descriptionUtils.ts';
import { generateMetaTags } from './metaTags.ts';
import { generateStructuredData } from './structuredData.ts';
import { generateHtmlStructure } from './htmlStructure.ts';
import { createResponseHeaders } from './responseUtils.ts';

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
  
  // Generate the different parts of the HTML
  const metaTagsHtml = generateMetaTags(metaData, shortDescription, longDescription, appDomain);
  const structuredDataScript = generateStructuredData(metaData, longDescription, appDomain);
  const html = generateHtmlStructure(metaData, metaTagsHtml, structuredDataScript, longDescription);
  
  // Create response headers
  const headers = createResponseHeaders(corsHeaders, listingId);

  return new Response(html, { headers });
};
