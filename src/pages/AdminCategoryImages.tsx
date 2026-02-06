
import { useAuth } from "@/contexts/AuthContext";

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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    ensureCategoryImagesBucket();
  }, []);

  return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Category Images</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Manage category images and visual content
                </p>
              </div>
            </div>
          </div>

          <CategoryImageManager />
        </div>

        <Footer />
      </div>
  );
};

export default AdminCategoryImages;
