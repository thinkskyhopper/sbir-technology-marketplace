
import { Users, Mail, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

interface UserWithStats {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  listing_count: number;
}

interface AdminUsersTableProps {
  users: UserWithStats[] | undefined;
}

const AdminUsersTable = ({ users }: AdminUsersTableProps) => {
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    navigate(`/profile?userId=${userId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>All Users</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Listings</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {(user.full_name || user.email)?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => handleUserClick(user.id)}
                          className="font-medium text-primary hover:underline cursor-pointer"
                        >
                          {user.full_name || 'No name provided'}
                        </button>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.role === 'admin' ? 'default' : user.role === 'consultant' ? 'secondary' : 'outline'}
                    className={
                      user.role === 'admin' 
                        ? 'bg-amber-500 hover:bg-amber-600' 
                        : user.role === 'consultant'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : ''
                    }
                  >
                    {user.role === 'admin' ? 'Administrator' : user.role === 'consultant' ? 'Consultant' : 'User'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium">{user.listing_count}</span>
                    <span className="text-muted-foreground text-sm">
                      listing{user.listing_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {users?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No users found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUsersTable;
