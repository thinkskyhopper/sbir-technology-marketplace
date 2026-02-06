
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface HeaderPostListingProps {
  onPostListingClick?: () => void;
}

const HeaderPostListing = ({ onPostListingClick }: HeaderPostListingProps) => {
  const { user, isAdmin, profile } = useAuth();
  const { toast } = useToast();

  const handlePostListing = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to post a listing",
        variant: "destructive",
      });
      return;
    }
    
    if (onPostListingClick) {
      onPostListingClick();
    }
  };

  // Check if user can submit listings (admins always can, others based on profile setting)
  const canSubmitListings = isAdmin || (profile?.can_submit_listings ?? false);

  if (!user || !canSubmitListings) return null;

  return (
    <>
      {/* Desktop Post Listing Button */}
      <Button 
        onClick={handlePostListing}
        size="sm"
        className="hidden sm:flex"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Listing
      </Button>

      {/* Mobile Post Listing Button */}
      <Button 
        onClick={handlePostListing}
        size="icon"
        className="sm:hidden h-8 w-8"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </>
  );
};

export default HeaderPostListing;
