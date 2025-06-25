
import { DialogHeader as UIDialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { SBIRListing } from "@/types/listings";

interface DialogHeaderProps {
  listing: SBIRListing;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Rejected':
      return 'destructive';
    case 'Sold':
      return 'outline';
    case 'Hidden':
      return 'outline';
    default:
      return 'outline';
  }
};

const DialogHeader = ({ listing }: DialogHeaderProps) => {
  return (
    <UIDialogHeader>
      <DialogTitle className="flex items-center gap-3">
        Edit SBIR Listing
        <Badge variant={getStatusBadgeVariant(listing.status)}>
          {listing.status}
        </Badge>
      </DialogTitle>
    </UIDialogHeader>
  );
};

export default DialogHeader;
