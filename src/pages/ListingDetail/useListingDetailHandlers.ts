
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

interface UseListingDetailHandlersProps {
  user: User | null;
  navigate: ReturnType<typeof useNavigate>;
  searchParams: URLSearchParams;
  deleteListing: (id: string) => Promise<void>;
  toast: any;
  setShowContactDialog: (show: boolean) => void;
  setShowCreateDialog: (show: boolean) => void;
  setShowRequestChangeDialog: (show: boolean) => void;
  setShowRequestDeletionDialog: (show: boolean) => void;
}

export const useListingDetailHandlers = ({
  user,
  navigate,
  searchParams,
  deleteListing,
  toast,
  setShowContactDialog,
  setShowCreateDialog,
  setShowRequestChangeDialog,
  setShowRequestDeletionDialog
}: UseListingDetailHandlersProps) => {
  
  const handleContactAdmin = () => {
    setShowContactDialog(true);
  };

  const handlePostListingClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowCreateDialog(true);
  };

  const handleBackToMarketplace = () => {
    const marketplaceParams = new URLSearchParams();
    marketplaceParams.set("view", "marketplace");
    
    if (searchParams.get("search")) marketplaceParams.set("search", searchParams.get("search")!);
    if (searchParams.get("phase")) marketplaceParams.set("phase", searchParams.get("phase")!);
    if (searchParams.get("category")) marketplaceParams.set("category", searchParams.get("category")!);
    if (searchParams.get("status")) marketplaceParams.set("status", searchParams.get("status")!);
    
    navigate(`/?${marketplaceParams.toString()}`);
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await deleteListing(listingId);
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
      handleBackToMarketplace();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete listing",
        variant: "destructive",
      });
    }
  };

  const handleRequestChange = () => {
    setShowRequestChangeDialog(true);
  };

  const handleRequestDeletion = () => {
    setShowRequestDeletionDialog(true);
  };

  return {
    handleContactAdmin,
    handlePostListingClick,
    handleBackToMarketplace,
    handleDeleteListing,
    handleRequestChange,
    handleRequestDeletion
  };
};
