
import { TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { SortDirection } from "@/hooks/useSorting";

interface SortableTableHeadProps {
  children: React.ReactNode;
  sortKey: string;
  currentSortColumn: string | null;
  currentSortDirection: SortDirection;
  onSort: (column: string) => void;
  className?: string;
}

const SortableTableHead = ({
  children,
  sortKey,
  currentSortColumn,
  currentSortDirection,
  onSort,
  className,
}: SortableTableHeadProps) => {
  const isActive = currentSortColumn === sortKey;
  
  const getSortIcon = () => {
    if (!isActive) {
      return <ChevronsUpDown className="w-4 h-4" />;
    }
    
    if (currentSortDirection === 'asc') {
      return <ChevronUp className="w-4 h-4" />;
    }
    
    if (currentSortDirection === 'desc') {
      return <ChevronDown className="w-4 h-4" />;
    }
    
    return <ChevronsUpDown className="w-4 h-4" />;
  };

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
        onClick={() => onSort(sortKey)}
      >
        <span className="flex items-center space-x-1">
          <span>{children}</span>
          {getSortIcon()}
        </span>
      </Button>
    </TableHead>
  );
};

export default SortableTableHead;
