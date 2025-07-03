
import { TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortState } from "@/hooks/useSorting";

interface SortableTableHeadProps {
  column: string;
  sortState: SortState;
  onSort: (column: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const SortableTableHead = ({
  column,
  sortState,
  onSort,
  children,
  className,
}: SortableTableHeadProps) => {
  const isSorted = sortState.column === column;
  const direction = sortState.direction;

  const getSortIcon = () => {
    if (!isSorted) return <ArrowUpDown className="h-4 w-4" />;
    return direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <TableHead className={cn("px-2", className)}>
      <Button
        variant="ghost"
        onClick={() => onSort(column)}
        className="h-auto p-0 font-medium hover:bg-transparent"
      >
        <span className="flex items-center gap-2">
          {children}
          {getSortIcon()}
        </span>
      </Button>
    </TableHead>
  );
};
