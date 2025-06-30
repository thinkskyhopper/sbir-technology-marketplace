
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import type { ListingChangeRequest } from "@/types/changeRequests";

interface AdminChangeRequestsTableDialogNotesSectionProps {
  selectedRequest: ListingChangeRequest;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  adminNotesForUser: string;
  setAdminNotesForUser: (notes: string) => void;
  savingNotes: boolean;
  onSaveInternalNotes: () => Promise<void>;
  isProcessed: boolean;
}

export const AdminChangeRequestsTableDialogNotesSection = ({
  selectedRequest,
  adminNotes,
  setAdminNotes,
  adminNotesForUser,
  setAdminNotesForUser,
  savingNotes,
  onSaveInternalNotes,
  isProcessed
}: AdminChangeRequestsTableDialogNotesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Internal Admin Notes */}
        <div>
          <Label htmlFor="admin-notes">Internal Notes (Not shared with user)</Label>
          <Textarea
            id="admin-notes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add internal admin notes here..."
            rows={3}
          />
          {selectedRequest.admin_notes && (
            <div className="mt-2">
              <Label className="text-sm font-medium">Current Internal Notes:</Label>
              <div className="mt-1 p-3 bg-muted rounded-md border">
                <p className="whitespace-pre-wrap text-sm">{selectedRequest.admin_notes}</p>
              </div>
            </div>
          )}
          
          {/* Save button for internal notes (available even after processing) */}
          {adminNotes.trim() && (
            <Button
              onClick={onSaveInternalNotes}
              disabled={savingNotes}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <Save className="w-4 h-4 mr-2" />
              {savingNotes ? "Saving..." : "Save Internal Notes"}
            </Button>
          )}
        </div>

        {/* User-Facing Admin Notes - Only show for pending requests */}
        {!isProcessed && (
          <div>
            <Label htmlFor="admin-notes-for-user">Notes for User (Will be included in email notifications)</Label>
            <Textarea
              id="admin-notes-for-user"
              value={adminNotesForUser}
              onChange={(e) => setAdminNotesForUser(e.target.value)}
              placeholder="Add notes that will be shared with the user..."
              rows={3}
            />
            {selectedRequest.admin_notes_for_user && (
              <div className="mt-2">
                <Label className="text-sm font-medium">Current User Notes:</Label>
                <div className="mt-1 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="whitespace-pre-wrap text-sm">{selectedRequest.admin_notes_for_user}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Show existing user notes for processed requests */}
        {isProcessed && selectedRequest.admin_notes_for_user && (
          <div>
            <Label className="text-sm font-medium">Notes Sent to User:</Label>
            <div className="mt-1 p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="whitespace-pre-wrap text-sm">{selectedRequest.admin_notes_for_user}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
