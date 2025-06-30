
import { Users, Mail, Calendar, FileText, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useSorting } from "@/hooks/useSorting";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface UserWithStats {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  listing_count: number;
  can_submit_listings: boolean;
}

interface AdminUsersTableProps {
  users: UserWithStats[] | undefined;
}

const AdminUsersTable = ({ users }: AdminUsersTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { sortedData, sortState, handleSort } = useSorting(users || [], {
    column: 'created_at',
    direction: 'desc'
  });

  const handleUserClick = (userId: string) => {
    navigate(`/profile?userId=${userId}`);
  };

  const handleSubmissionPermissionChange = async (userId: string, canSubmit: boolean) => {
    try {
      console.log('Updating submission permissions for user:', userId, 'to:', canSubmit);
      
      const { error } = await supabase
        .from('profiles')
        .update({ can_submit_listings: canSubmit })
        .eq('id', userId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully updated submission permissions');

      toast({
        title: "Success",
        description: `User submission permissions ${canSubmit ? 'enabled' : 'disabled'} successfully`,
        duration: 5000, // Auto-dismiss after 5 seconds
      });

      // Invalidate and refetch the users query to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      console.log('Query invalidated and refetch triggered');
      
    } catch (error) {
      console.error('Error updating submission permissions:', error);
      toast({
        title: "Error",
        description: "Failed to update user permissions",
        variant: "destructive",
        duration: 5000, // Auto-dismiss after 5 seconds
      });
    }
  };

  const getSortIcon = (column: string) => {
    if (sortState.column !== column) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortState.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  const SortableTableHead = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => handleSort(column)}
        className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
      >
        <div className="flex items-center space-x-2">
          <span>{children}</span>
          {getSortIcon(column)}
        </div>
      </Button>
    </TableHead>
  );

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
              <SortableTableHead column="full_name">User</SortableTableHead>
              <SortableTableHead column="role">Role</SortableTableHead>
              <SortableTableHead column="listing_count">Listings</SortableTableHead>
              <TableHead>Can Submit</TableHead>
              <SortableTableHead column="created_at">Joined</SortableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData?.map((user) => (
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
                        ? 'bg-white hover:bg-gray-50 text-black border-gray-300'
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
                  <Select
                    value={user.can_submit_listings ? 'enabled' : 'disabled'}
                    onValueChange={(value) => handleSubmissionPermissionChange(user.id, value === 'enabled')}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
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
