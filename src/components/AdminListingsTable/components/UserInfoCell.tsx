
import { TableCell } from "@/components/ui/table";
import { Link } from "react-router-dom";

interface UserInfoCellProps {
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
  userId: string;
}

const UserInfoCell = ({ profiles, userId }: UserInfoCellProps) => {
  return (
    <TableCell className="min-w-[180px]">
      {profiles ? (
        <div>
          <Link 
            to={`/profile?userId=${userId}`}
            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
          >
            {profiles.full_name || 'N/A'}
          </Link>
          <p className="text-xs text-muted-foreground">
            {profiles.email}
          </p>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">Unknown</span>
      )}
    </TableCell>
  );
};

export default UserInfoCell;
