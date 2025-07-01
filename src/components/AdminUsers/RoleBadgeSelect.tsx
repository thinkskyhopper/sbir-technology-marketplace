
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";

interface RoleBadgeSelectProps {
  role: string;
  isUpdating: boolean;
  onRoleChange: (newRole: string) => void;
  className?: string;
}

export const RoleBadgeSelect = ({
  role,
  isUpdating,
  onRoleChange,
  className
}: RoleBadgeSelectProps) => {
  const [open, setOpen] = useState(false);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'consultant': return 'secondary';
      case 'user': return 'outline';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'consultant': return 'Consultant';
      case 'user': return 'User';
      default: return role;
    }
  };

  if (isUpdating) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Updating...</span>
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`inline-flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full min-h-[44px] px-1 ${className}`}
        >
          <Badge variant={getRoleBadgeVariant(role)} className="text-xs cursor-pointer">
            {getRoleLabel(role)}
          </Badge>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-32">
        <DropdownMenuItem
          onClick={() => {
            onRoleChange('user');
            setOpen(false);
          }}
          className="cursor-pointer"
        >
          <Badge variant="outline" className="text-xs">
            User
          </Badge>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onRoleChange('consultant');
            setOpen(false);
          }}
          className="cursor-pointer"
        >
          <Badge variant="secondary" className="text-xs">
            Consultant
          </Badge>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onRoleChange('admin');
            setOpen(false);
          }}
          className="cursor-pointer"
        >
          <Badge variant="default" className="text-xs">
            Admin
          </Badge>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
