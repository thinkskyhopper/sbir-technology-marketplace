
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
          column="title"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="max-w-xs"
        >
          Title & Category
        </SortableTableHead>
        <SortableTableHead
          column="agency"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
        >
          Agency
        </SortableTableHead>
        <SortableTableHead
          column="phase"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
        >
          Phase
        </SortableTableHead>
        <SortableTableHead
          column="value"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
        >
          Value
        </SortableTableHead>
        <SortableTableHead
          column="deadline"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
        >
          Deadline
        </SortableTableHead>
        <SortableTableHead
          column="status"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
        >
          Status
        </SortableTableHead>
        <TableHead>Submitted By</TableHead>
        <SortableTableHead
          column="submitted_at"
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
