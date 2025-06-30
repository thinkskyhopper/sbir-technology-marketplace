
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Mail, Building, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EditProfileDialog from "./EditProfileDialog";

const ProfileHeader = () => {
  const { user, isAdmin } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (!user) return null;

  const displayEmail = profile?.display_email || user.email;
  const fullName = profile?.full_name || 'User Profile';
  const notificationCategories = Array.isArray(profile?.notification_categories) 
    ? profile.notification_categories as string[]
    : [];

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary/10">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <CardTitle className="text-2xl font-bold">
                  {fullName}
                </CardTitle>
                {isAdmin && (
                  <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Administrator</span>
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                Member since {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <EditProfileDialog />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{displayEmail}</span>
            </div>
            
            {profile?.company_name && (
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{profile.company_name}</span>
              </div>
            )}
          </div>

          {profile?.bio && (
            <div className="flex items-start space-x-3 pt-2">
              <FileText className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Bio</p>
                <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>
              </div>
            </div>
          )}

          {notificationCategories.length > 0 && (
            <div className="flex items-start space-x-3 pt-2">
              <Mail className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-2">Email Notifications</p>
                <div className="flex flex-wrap gap-1">
                  {notificationCategories.map((category: string) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
