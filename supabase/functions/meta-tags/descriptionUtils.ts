
import { escapeHtml, formatCurrency } from './textUtils.ts';
import type { Listing } from './types.ts';

export const createDescription = (listing: Listing): string => {
  const valueInDollars = listing.value / 100;
  const formattedValue = formatCurrency(valueInDollars);
  
  // Create a Twitter-optimized description (under 160 characters)
  const baseInfo = `${listing.phase} ${listing.category} from ${listing.agency}`;
  const valueInfo = `Value: ${formattedValue}`;
  
  // Start with base info and value
  let description = `${baseInfo}. ${valueInfo}.`;
  
  // Calculate remaining space for listing description
  const maxLength = 155; // Leave some buffer
  const remainingLength = maxLength - description.length - 3; // Space for "..."
  
  if (remainingLength > 20 && listing.description) {
    // Try to add some of the listing description
    let additionalDesc = listing.description.trim();
    
    // Clean up the description
    additionalDesc = additionalDesc.replace(/\s+/g, ' '); // Normalize whitespace
    additionalDesc = additionalDesc.replace(/[^\w\s\-.,!?]/g, ' '); // Remove special chars
    
    // Find a good breaking point
    if (additionalDesc.length <= remainingLength) {
      description = `${baseInfo}. ${valueInfo}. ${additionalDesc}`;
    } else {
      // Find the last complete word that fits
      const truncated = additionalDesc.substring(0, remainingLength);
      const lastSpaceIndex = truncated.lastIndexOf(' ');
      
      if (lastSpaceIndex > 10) {
        const finalDesc = additionalDesc.substring(0, lastSpaceIndex).trim();
        description = `${baseInfo}. ${valueInfo}. ${finalDesc}...`;
      }
    }
  }
  
  console.log('Generated Twitter description:', description);
  console.log('Description length:', description.length);
  
  return escapeHtml(description);
};

// Create a longer description for platforms that support it (like LinkedIn, Facebook)
export const createLongDescription = (listing: Listing): string => {
  const valueInDollars = listing.value / 100;
  const formattedValue = formatCurrency(valueInDollars);
  
  const baseDescription = `${listing.phase} ${listing.category} project from ${listing.agency}. Project value: ${formattedValue}.`;
  
  if (listing.description) {
    // For longer descriptions, allow up to 300 characters
    let cleanDesc = listing.description.trim();
    cleanDesc = cleanDesc.replace(/\s+/g, ' '); // Normalize whitespace
    cleanDesc = cleanDesc.replace(/[^\w\s\-.,!?()]/g, ' '); // Remove problematic special chars
    
    if (cleanDesc.length > 250) {
      const truncated = cleanDesc.substring(0, 250);
      const lastSpaceIndex = truncated.lastIndexOf(' ');
      if (lastSpaceIndex > 200) {
        cleanDesc = cleanDesc.substring(0, lastSpaceIndex) + '...';
      } else {
        cleanDesc = truncated + '...';
      }
    }
    
    const result = `${baseDescription} ${cleanDesc}`;
    console.log('Generated long description:', result);
    console.log('Long description length:', result.length);
    return escapeHtml(result);
  }
  
  return escapeHtml(baseDescription);
};
