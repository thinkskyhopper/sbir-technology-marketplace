
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Your Listings</h3>
              <p className="text-muted-foreground text-sm">
                Manage your SBIR listings and submissions
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Bookmarks</h3>
              <p className="text-muted-foreground text-sm">
                View your saved listings and opportunities
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Browse</h3>
              <p className="text-muted-foreground text-sm">
                Explore available SBIR opportunities
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
