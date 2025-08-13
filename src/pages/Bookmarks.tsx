
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookmarkedListings from "@/components/BookmarkedListings";
import CreateListingDialog from "@/components/CreateListingDialog";

const Bookmarks = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleShowBookmarkedListings = () => {
    // Already on bookmarks page
  };

  const handlePostListingClick = () => {
    setShowCreateDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          onShowBookmarkedListings={handleShowBookmarkedListings}
          onPostListingClick={handlePostListingClick}
        />
        <div className="flex-1 container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onShowBookmarkedListings={handleShowBookmarkedListings}
        onPostListingClick={handlePostListingClick}
      />
      <div className="flex-1">
        <BookmarkedListings />
      </div>
      <Footer />
      
      <CreateListingDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default Bookmarks;
