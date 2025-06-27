
import { LogIn, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import HeaderUserMenu from "./HeaderUserMenu";

interface HeaderActionsProps {
  onPostListingClick?: () => void;
}

const HeaderActions = ({ onPostListingClick }: HeaderActionsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/auth');
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
      {user ? (
        <>
          <Button 
            variant="outline" 
            onClick={onPostListingClick} 
            className="border-primary/20 hover:border-primary/40 h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-4"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Post Listing</span>
          </Button>
          
          <HeaderUserMenu />
        </>
      ) : (
        <Button 
          onClick={handleAuthClick} 
          className="bg-primary hover:bg-primary/90 h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-4"
        >
          <LogIn className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline">Sign In</span>
        </Button>
      )}
    </div>
  );
};

export default HeaderActions;
