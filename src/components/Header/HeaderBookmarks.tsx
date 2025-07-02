
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const HeaderBookmarks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleBookmarkedListings = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to view your bookmarks",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to dedicated bookmarks page
    navigate('/bookmarks');
  };

  if (!user) return null;

  return (
    <>
      {/* Desktop Bookmarks Button */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleBookmarkedListings}
        className="hidden sm:flex border-primary/20 hover:border-primary/40"
      >
        <Bookmark className="w-4 h-4 mr-2" />
        Bookmarks
      </Button>

      {/* Mobile Bookmarks Button */}
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleBookmarkedListings}
        className="sm:hidden h-8 w-8 border-primary/20 hover:border-primary/40"
      >
        <Bookmark className="w-4 h-4" />
      </Button>
    </>
  );
};

export default HeaderBookmarks;
