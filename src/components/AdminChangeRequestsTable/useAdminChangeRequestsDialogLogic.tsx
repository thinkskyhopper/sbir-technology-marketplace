
import type { ListingChangeRequest } from "@/types/changeRequests";

interface UseAdminChangeRequestsDialogLogicProps {
  selectedRequest: ListingChangeRequest | null;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
}

export const useAdminChangeRequestsDialogLogic = ({
  selectedRequest
}: UseAdminChangeRequestsDialogLogicProps) => {
  const isProcessed = selectedRequest?.status !== 'pending';

  return {
    isProcessed
  };
};
