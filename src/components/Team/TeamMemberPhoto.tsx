
import React from "react";
import { TeamMember } from "./TeamMembersList";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoveUp, MoveDown } from "lucide-react";

interface TeamMemberPhotoProps {
  member: TeamMember;
  onEdit: () => void;
  onDelete: () => void;
  onReorder: (direction: 'up' | 'down') => void;
}

const TeamMemberPhoto = ({ member, onEdit, onDelete, onReorder }: TeamMemberPhotoProps) => {
  const { isAdmin } = useAuth();

  return (
    <div className="flex-shrink-0">
      <div className="relative">
        <div className="w-64 h-64 rounded-full overflow-hidden bg-secondary/20">
          {member.photo_url ? (
            <img 
              src={member.photo_url} 
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-muted-foreground bg-gradient-to-br from-primary/20 to-secondary/20">
              {member.name.charAt(0)}
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="absolute -top-2 -right-2 flex flex-col gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={onEdit}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onDelete}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReorder('up')}
            >
              <MoveUp className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReorder('down')}
            >
              <MoveDown className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberPhoto;
