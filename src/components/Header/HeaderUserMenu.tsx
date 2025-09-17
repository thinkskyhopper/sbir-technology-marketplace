
import { LogOut, User, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const HeaderUserMenu = () => {
  const { user, signOut, isAdmin, profile } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAdminClick = () => {
    console.log('Admin button clicked, navigating to /admin');
    navigate('/admin');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  if (!user) return null;

  // Get the user's display name - prioritize first_name, then full_name, fallback to email
  const displayName = profile?.first_name || profile?.full_name || user.email;
  const firstName = profile?.first_name || (profile?.full_name ? profile.full_name.split(' ')[0] : user.email.split('@')[0]);
  
  // Get the initial for the avatar
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  console.log('HeaderUserMenu render:', { user: user.email, isAdmin });

return (
  isMobile ? (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          className="h-8 sm:h-10 gap-2 px-2 sm:px-3 border-primary/20 hover:border-primary/40"
        >
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
            <AvatarFallback className="text-xs sm:text-sm bg-primary text-primary-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium truncate max-w-24">
            {firstName}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-0">
        <DrawerHeader className="text-left">
          <DrawerTitle>User menu</DrawerTitle>
          <DrawerDescription>Account actions</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 space-y-3">
          <div className="text-sm">
            <div className="font-medium truncate">{user.email}</div>
            {profile?.full_name && (
              <div className="text-xs text-muted-foreground truncate mt-0.5">
                {profile.full_name}
              </div>
            )}
            {isAdmin && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Shield className="w-3 h-3 mr-1" />
                Administrator
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Button variant="ghost" className="justify-start" onClick={handleProfileClick}>
              <User className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button variant="ghost" className="justify-start" onClick={handleSettingsClick}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            {isAdmin && (
              <Button variant="ghost" className="justify-start" onClick={handleAdminClick}>
                <Settings className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Button>
            )}
            <Button variant="destructive" className="justify-start" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-8 sm:h-10 gap-2 px-2 sm:px-3 border-primary/20 hover:border-primary/40"
        >
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
            <AvatarFallback className="text-xs sm:text-sm bg-primary text-primary-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium truncate max-w-24">
            {firstName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        side="bottom"
        sideOffset={8}
        alignOffset={isMobile ? -16 : 0}
        avoidCollisions={false}
        collisionPadding={16}
        sticky="partial"
        hideWhenDetached={true}
        className={`w-56 z-[999] max-w-[90vw] sm:max-w-56 ${isMobile ? 'data-[state=open]:animate-none' : ''}`}
      >
        <div className="px-2 py-1.5 text-sm">
          <div className="font-medium truncate">{user.email}</div>
          {profile?.full_name && (
            <div className="text-xs text-muted-foreground truncate mt-0.5">
              {profile.full_name}
            </div>
          )}
          {isAdmin && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Shield className="w-3 h-3 mr-1" />
              Administrator
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="w-4 h-4 mr-2" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettingsClick}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
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
  )
);
};

export default HeaderUserMenu;
