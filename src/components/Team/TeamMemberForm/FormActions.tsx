
import React from "react";
import { Button } from "@/components/ui/button";
import { TeamMember } from "../TeamMembersList";

interface FormActionsProps {
  isSubmitting: boolean;
  member?: TeamMember;
}

const FormActions = ({ isSubmitting, member }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-6 border-t">
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : member ? "Update Member" : "Add Member"}
      </Button>
    </div>
  );
};

export default FormActions;
