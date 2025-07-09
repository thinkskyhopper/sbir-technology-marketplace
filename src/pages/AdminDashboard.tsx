
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-6 py-8 flex-1">
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.user_metadata?.full_name || 'Admin'}. Manage SBIR listings and platform content.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg border text-center">
            <h3 className="text-xl font-semibold mb-4">Admin Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Access admin features and management tools.
            </p>
            <button 
              onClick={() => navigate('/admin')}
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            >
              Go to Admin Panel
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
