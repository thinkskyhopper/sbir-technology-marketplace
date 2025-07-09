
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BookmarkedListings = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Bookmarked Listings</h1>
            <p className="text-muted-foreground">
              Your saved SBIR listings and opportunities
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg border text-center">
            <h3 className="text-xl font-semibold mb-4">Your Bookmarks</h3>
            <p className="text-muted-foreground">
              You haven't bookmarked any listings yet. Browse available opportunities to save your favorites.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default BookmarkedListings;
