
import React from "react";
import { TeamMember } from "./TeamMembersList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TeamMemberForm from "./TeamMemberForm";
import ConfirmActionDialog from "@/components/ConfirmActionDialog";

interface TeamMemberDialogsProps {
  member: TeamMember;
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  onUpdate: () => void;
  onDelete: () => void;
}

const TeamMemberDialogs = ({
  member,
  showEditDialog,
  setShowEditDialog,
  showDeleteDialog,
  setShowDeleteDialog,
  onUpdate,
  onDelete
}: TeamMemberDialogsProps) => {
  return (
    <>
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
        onConfirm={onDelete}
        title="Delete Team Member"
        description={`Are you sure you want to delete ${member.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
};

export default TeamMemberDialogs;
