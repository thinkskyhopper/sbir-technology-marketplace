import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  photoUrl?: string | null;
  name?: string | null;
  email?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const ProfileAvatar = ({ 
  photoUrl, 
  name, 
  email,
  className,
  fallbackClassName
}: ProfileAvatarProps) => {
  // Get initials for fallback
  const getInitials = () => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <Avatar className={cn("h-10 w-10", className)}>
      {photoUrl && (
        <AvatarImage 
          src={photoUrl} 
          alt={name || 'Profile photo'}
          className="object-cover"
        />
      )}
      <AvatarFallback className={cn("bg-primary/10 text-primary font-medium", fallbackClassName)}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
