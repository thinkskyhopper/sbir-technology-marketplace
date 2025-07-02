
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ProfileLoadingProps {
  onShowBookmarkedListings: () => void;
  onPostListingClick: () => void;
}

const ProfileLoading = ({ onShowBookmarkedListings, onPostListingClick }: ProfileLoadingProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onShowBookmarkedListings={onShowBookmarkedListings}
        onPostListingClick={onPostListingClick}
      />
      <div className="flex-1 container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Loading profile...</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileLoading;
