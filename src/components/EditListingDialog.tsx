
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import type { SBIRListing } from "@/types/listings";
import EditListingForm from "./EditListingDialog/EditListingForm";
import DialogHeader from "./EditListingDialog/DialogHeader";

interface EditListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: SBIRListing | null;
}

const EditListingDialog = ({ open, onOpenChange, listing }: EditListingDialogProps) => {
  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader listing={listing} />
        <EditListingForm 
          listing={listing} 
          onClose={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditListingDialog;
