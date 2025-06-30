
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Mail, Building } from "lucide-react";

const ProfileHeader = () => {
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary/10">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {user.user_metadata?.full_name || 'User Profile'}
              </CardTitle>
              <p className="text-muted-foreground">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {isAdmin && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Administrator</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>
          
          {user.user_metadata?.company_name && (
            <div className="flex items-center space-x-3">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{user.user_metadata.company_name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
