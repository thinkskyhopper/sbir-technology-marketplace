
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Users, TrendingUp } from "lucide-react";
import { UserWithStats } from "./types";

interface NotificationStatsProps {
  users: UserWithStats[] | undefined;
}

export const NotificationStats = ({ users }: NotificationStatsProps) => {
  if (!users) return null;

  // Calculate notification statistics
  const usersWithNotifications = users.filter(user => 
    user.notification_categories && 
    Array.isArray(user.notification_categories) && 
    user.notification_categories.length > 0
  );

  const totalUsersWithNotifications = usersWithNotifications.length;
  const totalUsers = users.length;
  const notificationRate = totalUsers > 0 ? Math.round((totalUsersWithNotifications / totalUsers) * 100) : 0;

  // Count subscriptions per category
  const categoryStats: Record<string, number> = {};
  usersWithNotifications.forEach(user => {
    if (user.notification_categories && Array.isArray(user.notification_categories)) {
      user.notification_categories.forEach(category => {
        if (typeof category === 'string') {
          categoryStats[category] = (categoryStats[category] || 0) + 1;
        }
      });
    }
  });

  const sortedCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10); // Show top 10 categories

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Email Notification Engagement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Users with notifications</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{totalUsersWithNotifications}</p>
                <p className="text-xs text-muted-foreground">of {totalUsers} total</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Engagement rate</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{notificationRate}%</p>
                <p className="text-xs text-muted-foreground">of all users</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedCategories.length > 0 ? (
            <div className="space-y-3">
              {sortedCategories.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {category}
                  </Badge>
                  <span className="text-sm font-medium">
                    {count} user{count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No category subscriptions found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
