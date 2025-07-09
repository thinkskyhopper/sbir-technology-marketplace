
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

interface StatusBadgeCellProps {
  status: string;
  dateSold?: string | null;
}

const StatusBadgeCell = ({ status, dateSold }: StatusBadgeCellProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      case 'Hidden': return 'outline';
      case 'Sold': return 'sold';
      default: return 'secondary';
    }
  };

  const getStatusBadgeClassName = (status: string) => {
    if (status === 'Active') {
      return 'bg-green-600 hover:bg-green-700 text-white border-transparent';
    }
    return '';
  };

  const renderStatusBadge = () => {
    // If status is "Sold" and we have a date_sold, wrap with tooltip
    if (status === 'Sold' && dateSold) {
      console.log('StatusBadgeCell - Rendering tooltip for sold listing:', {
        status,
        dateSold,
        formatted_date: format(new Date(dateSold), 'MMM d, yyyy')
      });

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">
              <Badge 
                variant={getStatusBadgeVariant(status)} 
                className={`text-xs ${getStatusBadgeClassName(status)}`}
              >
                {status}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sold on {format(new Date(dateSold), 'MMM d, yyyy')}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Badge 
        variant={getStatusBadgeVariant(status)} 
        className={`text-xs ${getStatusBadgeClassName(status)}`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <TableCell>
      {renderStatusBadge()}
    </TableCell>
  );
};

export default StatusBadgeCell;
