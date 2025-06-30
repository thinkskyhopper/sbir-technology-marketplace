
import { Users } from "lucide-react";

const AdminUsersHeader = () => {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <Users className="w-8 h-8 text-primary" />
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts and view user statistics
        </p>
      </div>
    </div>
  );
};

export default AdminUsersHeader;
