
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminListingsTable from "@/components/AdminListingsTable";
import AdminChangeRequestsTable from "@/components/AdminChangeRequestsTable";
import CategoryImageManager from "@/components/CategoryImageManager";
import CreateListingDialog from "@/components/CreateListingDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ensureCategoryImagesBucket } from "@/utils/createCategoryImagesBucket";

const Admin = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { user } = useAuth();

  // Ensure storage bucket exists when admin page loads
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
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage SBIR listings and platform content
                </p>
              </div>
            </div>
            
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Listing
            </Button>
          </div>

          <div className="space-y-8">
            <AdminChangeRequestsTable />
            <AdminListingsTable />
            <CategoryImageManager />
          </div>
          
          <CreateListingDialog 
            open={showCreateDialog} 
            onOpenChange={setShowCreateDialog} 
          />
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
