
import { useBasicListingOperations } from './useBasicListingOperations';
import { useAdminListingOperations } from './useAdminListingOperations';

export const useListingOperations = (onSuccess?: () => void) => {
  const {
    createListing,
    updateListing,
    loading: basicLoading
  } = useBasicListingOperations(onSuccess);

  const {
    approveListing,
    rejectListing,
    hideListing,
    deleteListing,
    loading: adminLoading
  } = useAdminListingOperations(onSuccess);

  const loading = basicLoading || adminLoading;

  return {
    createListing,
    updateListing,
    approveListing,
    rejectListing,
    hideListing,
    deleteListing,
    loading
  };
};
