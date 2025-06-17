
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  isSubmitting: boolean;
  userAttempts: boolean;
  onCancel: () => void;
}

const DialogActions = ({ isSubmitting, userAttempts, onCancel }: DialogActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || userAttempts}
      >
        {isSubmitting ? "Submitting..." : "Submit for Review"}
      </Button>
    </div>
  );
};

export default DialogActions;
