
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChangeRequestOperations } from "@/hooks/useChangeRequestOperations";
import { useToast } from "@/hooks/use-toast";
import type { SBIRListing } from "@/types/listings";

interface RequestChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: SBIRListing | null;
}

const RequestChangeDialog = ({ open, onOpenChange, listing }: RequestChangeDialogProps) => {
  const [requestType, setRequestType] = useState<'change' | 'deletion'>('change');
  const [reason, setReason] = useState("");
  const [requestedChanges, setRequestedChanges] = useState("");
  const { createChangeRequest, loading } = useChangeRequestOperations();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!listing) return;

    try {
      await createChangeRequest({
        listing_id: listing.id,
        request_type: requestType,
        reason,
        requested_changes: requestType === 'change' ? { description: requestedChanges } : null,
        listing_title: listing.title,
        listing_agency: listing.agency
      });

      toast({
        title: "Request Submitted",
        description: `Your ${requestType} request has been submitted successfully.`,
      });

      // Reset form
      setReason("");
      setRequestedChanges("");
      setRequestType('change');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting change request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Determine available request types based on listing status
  const getAvailableRequestTypes = () => {
    if (!listing) return [];
    
    if (listing.status === 'Sold') {
      return [{ value: 'deletion', label: 'Request Deletion' }];
    }
    
    if (listing.status === 'Active') {
      return [
        { value: 'change', label: 'Request Changes' },
        { value: 'deletion', label: 'Request Deletion' }
      ];
    }
    
    return [];
  };

  const availableRequestTypes = getAvailableRequestTypes();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Changes</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="request-type">Request Type</Label>
            <Select value={requestType} onValueChange={(value: 'change' | 'deletion') => setRequestType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                {availableRequestTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason">Reason for Request</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you need this change..."
              required
              rows={3}
            />
          </div>

          {requestType === 'change' && (
            <div>
              <Label htmlFor="requested-changes">Requested Changes</Label>
              <Textarea
                id="requested-changes"
                value={requestedChanges}
                onChange={(e) => setRequestedChanges(e.target.value)}
                placeholder="Describe the specific changes you want to make..."
                required
                rows={4}
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !reason.trim() || (requestType === 'change' && !requestedChanges.trim())}
              className="flex-1"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestChangeDialog;
