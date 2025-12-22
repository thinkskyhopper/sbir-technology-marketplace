
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { AdminAuditLog } from "./types";

interface AdminLogsTableRowProps {
  log: AdminAuditLog;
  onViewDetails: (log: AdminAuditLog) => void;
}

export const AdminLogsTableRow = ({ log, onViewDetails }: AdminLogsTableRowProps) => {
  const navigate = useNavigate();

  const getActionBadgeVariant = (actionType: string) => {
    switch (actionType) {
      case 'approval':
        return 'default';
      case 'denial':
        return 'destructive';
      case 'edit':
        return 'secondary';
      case 'deletion':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getActionBadgeClassName = (actionType: string) => {
    if (actionType === 'approval') {
      return 'bg-green-600 hover:bg-green-700 text-white border-transparent';
    }
    if (actionType === 'edit') {
      return 'bg-amber-500 hover:bg-amber-600 text-white border-transparent';
    }
    return '';
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'approval':
        return 'Approved';
      case 'denial':
        return 'Rejected';
      case 'edit':
        return 'Modified';
      case 'deletion':
        return 'Deleted';
      default:
        return actionType;
    }
  };

  const handleListingClick = () => {
    if (log.listing_id) {
      // Use public_id for URLs when available, fall back to UUID
      navigate(`/listing/${log.listing?.public_id || log.listing_id}`);
    }
  };

  const isListingDeleted = !log.listing || (log.listing && log.action_type === 'deletion');
  const adminName = log.admin?.full_name || log.admin?.email || 'Unknown Admin';

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {log.listing_id && !isListingDeleted ? (
              <button
                onClick={handleListingClick}
                className="truncate max-w-[200px] text-left text-primary hover:underline focus:underline focus:outline-none"
                title={log.listing_title}
              >
                {log.listing_title}
              </button>
            ) : (
              <span className="truncate max-w-[200px]" title={log.listing_title}>
                {log.listing_title}
              </span>
            )}
            {isListingDeleted && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Deleted
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {log.listing_agency}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant={getActionBadgeVariant(log.action_type)}
          className={getActionBadgeClassName(log.action_type)}
        >
          {getActionLabel(log.action_type)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {format(new Date(log.created_at), 'MMM dd, yyyy')}
        </div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(log.created_at), 'HH:mm')}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm font-medium truncate max-w-[150px]" title={adminName}>
          {adminName}
        </div>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(log)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
