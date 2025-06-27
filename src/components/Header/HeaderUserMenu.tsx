
import { LogOut, User, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const HeaderUserMenu = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
          <User className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium truncate">{user.email}</div>
          {isAdmin && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Shield className="w-3 h-3 mr-1" />
              Administrator
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem onClick={handleAdminClick}>
            <Settings className="w-4 h-4 mr-2" />
            Admin Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderUserMenu;
