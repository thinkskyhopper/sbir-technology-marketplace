import { escapeHtml, formatCurrency } from './textUtils.ts';
import type { Listing } from './types.ts';

export const createDescription = (listing: Listing): string => {
  const valueInDollars = listing.value / 100;
  const formattedValue = formatCurrency(valueInDollars);
  
  // Create a shorter, more Twitter-friendly description
  const baseDescription = `${listing.phase} ${listing.category} from ${listing.agency}. ${formattedValue}.`;
  
  // For Twitter, keep it under 120 characters to be safe
  const maxLength = 120;
  const remainingLength = maxLength - baseDescription.length - 3; // Leave space for "..."
  
  if (remainingLength > 20 && listing.description) {
    // Take first sentence or first 60 chars, whichever is shorter
    let truncatedDesc = listing.description;
    const firstSentence = listing.description.split(/[.!?]/)[0];
    
    if (firstSentence && firstSentence.length <= remainingLength) {
      truncatedDesc = firstSentence;
    } else {
      truncatedDesc = listing.description.substring(0, remainingLength);
    }
    
    return escapeHtml(`${baseDescription} ${truncatedDesc}...`);
  }
  
  return escapeHtml(baseDescription);
};

// Create a longer description for platforms that support it
export const createLongDescription = (listing: Listing): string => {
  const valueInDollars = listing.value / 100;
  const formattedValue = formatCurrency(valueInDollars);
  
  const baseDescription = `${listing.phase} ${listing.category} project from ${listing.agency}. Project value: ${formattedValue}.`;
  
  if (listing.description) {
    const cleanDesc = listing.description.substring(0, 300);
    return escapeHtml(`${baseDescription} ${cleanDesc}`);
  }
  
  return escapeHtml(baseDescription);
};
