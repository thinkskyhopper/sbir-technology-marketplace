
import React, { useState } from "react";
import { TeamMember } from "./TeamMembersList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TeamMemberPhoto from "./TeamMemberPhoto";
import TeamMemberBio from "./TeamMemberBio";
import TeamMemberDialogs from "./TeamMemberDialogs";

interface TeamMemberCardProps {
  member: TeamMember;
  isReversed: boolean;
  onUpdate: () => void;
}

const TeamMemberCard = ({ member, isReversed, onUpdate }: TeamMemberCardProps) => {
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', member.id);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Team member deleted successfully.",
      });
      
      onUpdate();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Error",
        description: "Failed to delete team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReorder = async (direction: 'up' | 'down') => {
    try {
      const newOrder = direction === 'up' ? member.display_order - 1 : member.display_order + 1;
      
      const { error } = await supabase
        .from('team_members')
        .update({ display_order: newOrder })
        .eq('id', member.id);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Team member order updated.",
      });
      
      onUpdate();
    } catch (error) {
      console.error('Error reordering team member:', error);
      toast({
        title: "Error", 
        description: "Failed to reorder team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
        <TeamMemberPhoto
          member={member}
          onEdit={() => setShowEditDialog(true)}
          onDelete={() => setShowDeleteDialog(true)}
          onReorder={handleReorder}
        />
        
        <TeamMemberBio
          member={member}
          isReversed={isReversed}
        />
      </div>

      <TeamMemberDialogs
        member={member}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        onUpdate={onUpdate}
        onDelete={handleDelete}
      />
    </>
  );
};

export default TeamMemberCard;
