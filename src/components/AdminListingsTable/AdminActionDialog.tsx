
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface AdminActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userNotes?: string, internalNotes?: string) => void;
  title: string;
  description: string;
  confirmText: string;
  variant?: 'default' | 'destructive';
  showNotesForm?: boolean;
}

export const AdminActionDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText,
  variant = 'default',
  showNotesForm = true,
}: AdminActionDialogProps) => {
  const [userNotes, setUserNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(userNotes.trim() || undefined, internalNotes.trim() || undefined);
    // Reset form
    setUserNotes('');
    setInternalNotes('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form
    setUserNotes('');
    setInternalNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {description}
          </p>

          {showNotesForm && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-notes">
                    Notes for User
                    <span className="text-xs text-muted-foreground ml-2">
                      (Will be shared with the listing owner)
                    </span>
                  </Label>
                  <Textarea
                    id="user-notes"
                    placeholder="Enter notes that will be shared with the user..."
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internal-notes">
                    Internal Notes
                    <span className="text-xs text-muted-foreground ml-2">
                      (Admin only - not shared with user)
                    </span>
                  </Label>
                  <Textarea
                    id="internal-notes"
                    placeholder="Enter internal notes for admin reference..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
