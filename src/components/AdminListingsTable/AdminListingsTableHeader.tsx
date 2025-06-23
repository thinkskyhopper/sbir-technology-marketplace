
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
          className="max-w-xs"
        >
          Title & Category
        </SortableTableHead>
        <SortableTableHead
          sortKey="agency"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
        >
          Agency
        </SortableTableHead>
        <SortableTableHead
          sortKey="phase"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
        >
          Phase
        </SortableTableHead>
        <SortableTableHead
          sortKey="value"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
        >
          Value
        </SortableTableHead>
        <SortableTableHead
          sortKey="deadline"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
        >
          Deadline
        </SortableTableHead>
        <SortableTableHead
          sortKey="status"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
        >
          Status
        </SortableTableHead>
        <TableHead>Submitted By</TableHead>
        <SortableTableHead
          sortKey="submitted_at"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
        >
          Submitted
        </SortableTableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AdminListingsTableHeader;
