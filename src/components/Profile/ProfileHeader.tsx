
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Building, Calendar, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  display_email: string | null;
  company_name: string | null;
  bio: string | null;
  role: string;
  created_at?: string;
  updated_at?: string;
}

interface ProfileHeaderProps {
  profile?: Profile | null;
  isOwnProfile: boolean;
  onEdit: () => void;
  userId?: string | null;
}

const ProfileHeader = ({ profile: propProfile, isOwnProfile, onEdit, userId }: ProfileHeaderProps) => {
  const { profile: authProfile } = useAuth();

  // Use the passed profile or fall back to auth profile for own profile
  const displayProfile = propProfile || (isOwnProfile ? authProfile : null);

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
                {displayProfile.display_email && (
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-1" />
                    <span className="text-sm">{displayProfile.display_email}</span>
                  </div>
                )}
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
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
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
          {displayProfile.created_at && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                Joined {new Date(displayProfile.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
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
