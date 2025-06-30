
import { FileText } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CreateListingDialog from "../../CreateListingDialog";

interface ProfileListingsHeaderProps {
  listingCount: number;
  isViewingOwnProfile: boolean;
  createDialogOpen: boolean;
  onCreateDialogOpenChange: (open: boolean) => void;
}

const ProfileListingsHeader = ({
  listingCount,
  isViewingOwnProfile,
  createDialogOpen,
  onCreateDialogOpenChange
}: ProfileListingsHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>SBIR Listings</span>
          <Badge variant="secondary">{listingCount}</Badge>
        </CardTitle>
        {isViewingOwnProfile && (
          <CreateListingDialog 
            open={createDialogOpen} 
            onOpenChange={onCreateDialogOpenChange} 
          />
        )}
      </div>
    </CardHeader>
  );
};

export default ProfileListingsHeader;
