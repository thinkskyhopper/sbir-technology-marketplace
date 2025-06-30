
interface ProfileListingsEmptyProps {
  isViewingOwnProfile: boolean;
}

const ProfileListingsEmpty = ({ isViewingOwnProfile }: ProfileListingsEmptyProps) => {
  return (
    <div className="text-center text-muted-foreground py-8">
      {isViewingOwnProfile 
        ? "You don't have any active or sold SBIR listings." 
        : "This user doesn't have any active or sold SBIR listings."
      }
    </div>
  );
};

export default ProfileListingsEmpty;
