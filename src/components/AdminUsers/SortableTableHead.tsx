
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SortState } from "@/hooks/useSorting";

interface SortableTableHeadProps {
  column: string;
  children: React.ReactNode;
  sortState: SortState;
  onSort: (column: string) => void;
  className?: string;
}

export const SortableTableHead = ({ column, children, sortState, onSort, className }: SortableTableHeadProps) => {
  const getSortIcon = (column: string) => {
    if (sortState.column !== column) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortState.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        onClick={() => onSort(column)}
        className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
      >
        <div className="flex items-center space-x-2">
          <span>{children}</span>
          {getSortIcon(column)}
        </div>
      </Button>
    </TableHead>
  );
};
