
import { TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import type { SBIRListing } from "@/types/listings";

interface ListingTitleCellProps {
  listing: SBIRListing;
  requestSummary?: {
    total_pending: number;
    pending_changes: number;
    pending_deletions: number;
  } | null;
}

const ListingTitleCell = ({ listing, requestSummary }: ListingTitleCellProps) => {
  return (
    <TableCell>
      <div className="flex items-start space-x-2">
        <div className="flex-1 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                to={`/listing/${listing.public_id || listing.id}`}
                className="font-medium text-sm cursor-pointer hover:text-primary transition-colors"
              >
                {listing.title}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">{listing.title}</p>
            </TooltipContent>
          </Tooltip>
          <p className="text-xs text-muted-foreground">{listing.category}</p>
        </div>
        {requestSummary && requestSummary.total_pending > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p className="font-medium">Pending Requests:</p>
                {requestSummary.pending_changes > 0 && (
                  <p>{requestSummary.pending_changes} change request(s)</p>
                )}
                {requestSummary.pending_deletions > 0 && (
                  <p>{requestSummary.pending_deletions} deletion request(s)</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TableCell>
  );
};

export default ListingTitleCell;
