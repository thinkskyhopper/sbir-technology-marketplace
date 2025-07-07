
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminUsersStatsProps {
  totalUsers: number;
  adminUsers: number;
  consultantUsers: number;
  regularUsers: number;
  marketingSubscribers: number;
}

const AdminUsersStats = ({ 
  totalUsers, 
  adminUsers, 
  consultantUsers, 
  regularUsers,
  marketingSubscribers 
}: AdminUsersStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Marketing Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{marketingSubscribers}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersStats;
