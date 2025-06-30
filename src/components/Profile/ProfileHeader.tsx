
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Building, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditProfileDialog from "./EditProfileDialog";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  display_email: string | null;
  company_name: string | null;
  bio: string | null;
  role: string;
  created_at: string;
}

interface ProfileHeaderProps {
  profile?: Profile | null;
  isOwnProfile: boolean;
  onEdit: () => void;
  userId?: string | null;
}

const ProfileHeader = ({ profile: propProfile, isOwnProfile, onEdit, userId }: ProfileHeaderProps) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId && !propProfile
  });

  const displayProfile = propProfile || profile;

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!displayProfile) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Profile not found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {displayProfile.full_name || 'No name provided'}
              </CardTitle>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="w-4 h-4 mr-1" />
                  <span className="text-sm">{displayProfile.display_email || displayProfile.email}</span>
                </div>
                <Badge 
                  variant={displayProfile.role === 'admin' ? 'default' : displayProfile.role === 'consultant' ? 'secondary' : 'outline'}
                  className={
                    displayProfile.role === 'admin' 
                      ? 'bg-amber-500 hover:bg-amber-600' 
                      : displayProfile.role === 'consultant'
                      ? 'bg-white hover:bg-gray-50 text-black border-gray-300'
                      : ''
                  }
                >
                  {displayProfile.role === 'admin' ? 'Administrator' : displayProfile.role === 'consultant' ? 'Consultant' : 'User'}
                </Badge>
              </div>
            </div>
          </div>
          {isOwnProfile && (
            <button onClick={onEdit} className="text-sm text-muted-foreground hover:text-foreground">
              Edit Profile
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayProfile.company_name && (
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{displayProfile.company_name}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              Joined {new Date(displayProfile.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        {displayProfile.bio && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">About</h4>
            <p className="text-sm text-muted-foreground">{displayProfile.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
