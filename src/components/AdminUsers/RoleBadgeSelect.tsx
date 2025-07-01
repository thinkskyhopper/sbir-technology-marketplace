
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

  const getRoleBadgeProps = (role: string) => {
    switch (role) {
      case 'admin': 
        return { 
          className: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500',
          children: 'Administrator'
        };
      case 'consultant': 
        return { 
          className: 'bg-white hover:bg-gray-50 text-black border-gray-300',
          children: 'Consultant'
        };
      case 'user': 
        return { 
          variant: 'outline' as const,
          children: 'User'
        };
      default: 
        return { 
          variant: 'outline' as const,
          children: role 
        };
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

  const currentBadgeProps = getRoleBadgeProps(role);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`inline-flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full min-h-[44px] px-1 ${className}`}
        >
          <Badge {...currentBadgeProps} className={`text-xs cursor-pointer ${currentBadgeProps.className || ''}`} />
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
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
          <Badge className="text-xs bg-white hover:bg-gray-50 text-black border-gray-300">
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
          <Badge className="text-xs bg-amber-500 hover:bg-amber-600 text-white border-amber-500">
            Administrator
          </Badge>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
