
import { escapeHtml, formatCurrency } from './textUtils.ts';
import type { Listing } from './types.ts';

export const createDescription = (listing: Listing): string => {
  const valueInDollars = listing.value / 100;
  const formattedValue = formatCurrency(valueInDollars);
  
  const baseDescription = `${listing.phase} ${listing.category} project from ${listing.agency}. Value: ${formattedValue}.`;
  const remainingLength = 160 - baseDescription.length - 3; // Leave space for "..."
  
  if (remainingLength > 0 && listing.description) {
    const truncatedDesc = listing.description.substring(0, remainingLength);
    return escapeHtml(`${baseDescription} ${truncatedDesc}...`);
  }
  
  return escapeHtml(baseDescription);
};
