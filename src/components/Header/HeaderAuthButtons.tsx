
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeaderAuthButtons = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/auth');
  };

  if (user) return null;

  return (
    <Button 
      onClick={handleAuthClick} 
      size="sm"
      className="bg-primary hover:bg-primary/90"
    >
      <LogIn className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
      <span className="hidden sm:inline">Sign In</span>
    </Button>
  );
};

export default HeaderAuthButtons;
