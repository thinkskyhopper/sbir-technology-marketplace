
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SortableTableHead from "./SortableTableHead";

interface AdminListingsTableHeaderProps {
  currentSortColumn: string | null;
  currentSortDirection: 'asc' | 'desc' | null;
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
          className="max-w-[250px] min-w-[200px]"
        >
          Title & Category
        </SortableTableHead>
        <SortableTableHead
          sortKey="agency"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="max-w-[120px] min-w-[100px]"
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
          className="min-w-[100px] text-right"
        >
          Value
        </SortableTableHead>
        <SortableTableHead
          sortKey="deadline"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="min-w-[100px]"
        >
          Deadline
        </SortableTableHead>
        <SortableTableHead
          sortKey="status"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="min-w-[90px]"
        >
          Status
        </SortableTableHead>
        <TableHead className="max-w-[140px] min-w-[120px]">Submitted By</TableHead>
        <SortableTableHead
          sortKey="submitted_at"
          currentSortColumn={currentSortColumn}
          currentSortDirection={currentSortDirection}
          onSort={onSort}
          className="min-w-[100px]"
        >
          Submitted
        </SortableTableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AdminListingsTableHeader;
