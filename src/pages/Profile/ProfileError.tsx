
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ProfileErrorProps {
  message: string;
  onShowBookmarkedListings: () => void;
  onPostListingClick: () => void;
}

const ProfileError = ({ message, onShowBookmarkedListings, onPostListingClick }: ProfileErrorProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onShowBookmarkedListings={onShowBookmarkedListings}
        onPostListingClick={onPostListingClick}
      />
      <div className="flex-1 container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>{message}</p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileError;
