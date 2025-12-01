
import { LogOut, User, Shield, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const HeaderUserMenu = () => {
  const { user, signOut, isAdmin, profile } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      console.log('Attempting to sign out...');
      
      const result = await signOut();
      
      if (result?.error && !result?.wasStaleSession) {
        // Only show error if it's not a stale session
        console.error('Sign out failed:', result.error);
        toast({
          title: "Sign out failed",
          description: "There was an error signing out. Please try again.",
          variant: "destructive"
        });
      } else {
        // Success or stale session (both are treated as success)
        if (result?.wasStaleSession) {
          console.log('Signed out with stale session cleanup');
        }
        toast({
          title: "Signed out successfully",
          description: "You have been signed out of your account."
        });
      }
      
      // Always navigate to home, even if there was an error
      // This ensures the UI updates properly
      navigate('/');
    } catch (err) {
      console.error('Sign out exception:', err);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred. Please refresh the page.",
        variant: "destructive"
      });
      // Still navigate to clear the UI state
      navigate('/');
    } finally {
      setIsSigningOut(false);
    }
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

  console.log('HeaderUserMenu render:', { user: user.email, isAdmin });

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-8 sm:h-10 gap-2 px-2 sm:px-3 border-primary/20 hover:border-primary/40"
        >
          <ProfileAvatar
            photoUrl={profile?.photo_url}
            name={profile?.full_name}
            email={user.email}
            className="h-6 w-6 sm:h-8 sm:w-8"
            fallbackClassName="text-xs sm:text-sm bg-primary text-primary-foreground"
          />
          <span className="hidden sm:inline text-sm font-medium truncate max-w-24">
            {firstName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        side="bottom"
        sideOffset={6}
        className="w-56 z-[999] max-w-[90vw] sm:max-w-56"
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
        <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 mr-2" />
          )}
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderUserMenu;
