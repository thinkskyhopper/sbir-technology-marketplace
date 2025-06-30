
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryImageManager from "@/components/CategoryImageManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ensureCategoryImagesBucket } from "@/utils/createCategoryImagesBucket";

const AdminCategoryImages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    ensureCategoryImagesBucket();
  }, []);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-6 py-8 flex-1">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Category Images</h1>
                <p className="text-muted-foreground">
                  Manage category images and visual content
                </p>
              </div>
            </div>
          </div>

          <CategoryImageManager />
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminCategoryImages;
