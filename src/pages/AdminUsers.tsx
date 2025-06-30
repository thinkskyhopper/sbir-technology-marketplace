
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Mail, Calendar, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Get all users with their listing counts
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          role,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get listing counts for each user
      const usersWithStats: UserWithStats[] = await Promise.all(
        profiles.map(async (profile) => {
          const { count } = await supabase
            .from('sbir_listings')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);

          return {
            ...profile,
            listing_count: count || 0
          };
        })
      );

      return usersWithStats;
    }
  });

  const totalUsers = users?.length || 0;
  const adminUsers = users?.filter(user => user.role === 'admin').length || 0;
  const consultantUsers = users?.filter(user => user.role === 'consultant').length || 0;
  const regularUsers = users?.filter(user => user.role === 'user').length || 0;

  const handleUserClick = (userId: string) => {
    navigate(`/profile?userId=${userId}`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <div className="container mx-auto px-6 py-8 flex-1">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-6 py-8 flex-1">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">
                  Manage user accounts and view user statistics
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminUsers}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Consultants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{consultantUsers}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Regular Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{regularUsers}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Users Table */}
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
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminUsers;
