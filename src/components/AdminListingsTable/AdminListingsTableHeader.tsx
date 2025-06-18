
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminListingsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Title</TableHead>
        <TableHead>Agency</TableHead>
        <TableHead>Phase</TableHead>
        <TableHead>Value</TableHead>
        <TableHead>Deadline</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Submitted</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AdminListingsTableHeader;
