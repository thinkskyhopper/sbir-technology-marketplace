
import { listingQueries } from './listingQueries';
import { listingOperations } from './listingOperations';
import { adminOperations } from './adminOperations';

export const listingsService = {
  // Query operations
  fetchListings: listingQueries.fetchListings.bind(listingQueries),

  // Basic CRUD operations
  createListing: listingOperations.createListing,
  updateListing: listingOperations.updateListing,

  // Admin operations
  approveListing: adminOperations.approveListing,
  rejectListing: adminOperations.rejectListing,
  hideListing: adminOperations.hideListing,
  deleteListing: adminOperations.deleteListing,
};
