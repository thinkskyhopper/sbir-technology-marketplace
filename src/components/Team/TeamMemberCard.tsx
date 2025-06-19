
import React, { useState } from "react";
import { TeamMember } from "./TeamMembersList";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, MoveUp, MoveDown } from "lucide-react";
import TeamMemberForm from "./TeamMemberForm";
import ConfirmActionDialog from "@/components/ConfirmActionDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TeamMemberCardProps {
  member: TeamMember;
  isReversed: boolean;
  onUpdate: () => void;
}

const TeamMemberCard = ({ member, isReversed, onUpdate }: TeamMemberCardProps) => {
  const { isAdmin } = useAuth();
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
        {/* Photo Section */}
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
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReorder('up')}
                >
                  <MoveUp className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReorder('down')}
                >
                  <MoveDown className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <Card className={`flex-1 ${isReversed ? 'bg-background/60' : 'bg-background/80'}`}>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">{member.name}</h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {member.bio}
              </p>
            </div>

            {/* Promotion Section */}
            {member.promotion_title && (
              <div className="mt-8 p-6 rounded-lg bg-background/50 border">
                <div className="flex flex-col md:flex-row gap-6">
                  {member.promotion_photo_url && (
                    <div className="flex-shrink-0">
                      <img 
                        src={member.promotion_photo_url}
                        alt={member.promotion_title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2 text-primary">
                      {member.promotion_title}
                    </h4>
                    {member.promotion_description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {member.promotion_description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <TeamMemberForm 
            member={member}
            onSuccess={() => {
              setShowEditDialog(false);
              onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmActionDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Team Member"
        description={`Are you sure you want to delete ${member.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
};

export default TeamMemberCard;
