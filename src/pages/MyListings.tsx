
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MyListings = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Listings</h1>
            <p className="text-muted-foreground">
              Manage your SBIR listings and submissions
            </p>
          </div>

          <div className="bg-card p-8 rounded-lg border text-center">
            <h3 className="text-xl font-semibold mb-4">Your Listings</h3>
            <p className="text-muted-foreground">
              You haven't submitted any listings yet. Create your first SBIR listing to get started.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default MyListings;
