

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SortableTableHead from "./SortableTableHead";

interface AdminListingsTableHeaderProps {
  currentSortColumn: string;
  currentSortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const AdminListingsTableHeader = ({
  currentSortColumn,
  currentSortDirection,
  onSort,
}: AdminListingsTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <SortableTableHead
          sortKey="title"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="max-w-[200px] min-w-[150px]"
        >
          Title & Category
        </SortableTableHead>
        <SortableTableHead
          sortKey="agency"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="max-w-[80px]"
        >
          Agency
        </SortableTableHead>
        <SortableTableHead
          sortKey="phase"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="min-w-[90px]"
        >
          Phase
        </SortableTableHead>
        <SortableTableHead
          sortKey="value"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="min-w-[80px] text-right"
        >
          Value
        </SortableTableHead>
        <SortableTableHead
          sortKey="deadline"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="min-w-[80px]"
        >
          Deadline
        </SortableTableHead>
        <SortableTableHead
          sortKey="status"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="min-w-[80px]"
        >
          Status
        </SortableTableHead>
        <TableHead className="max-w-[120px] min-w-[100px]">Submitted By</TableHead>
        <SortableTableHead
          sortKey="submitted_at"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="min-w-[80px]"
        >
          Submitted
        </SortableTableHead>
        <TableHead className="w-[80px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AdminListingsTableHeader;

