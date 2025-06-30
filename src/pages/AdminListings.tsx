
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminListingsTable from "@/components/AdminListingsTable";
import CreateListingDialog from "@/components/CreateListingDialog";
import { CSVUploadDialog } from "@/components/CSVUpload";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const AdminListings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCSVUploadDialog, setShowCSVUploadDialog] = useState(false);

  const handleCSVUploadSuccess = () => {
    // Refresh the listings data after successful CSV upload
    queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
  };

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
                <h1 className="text-3xl font-bold">SBIR Listings</h1>
                <p className="text-muted-foreground">
                  Manage all SBIR listings and approvals
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowCSVUploadDialog(true)}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Import CSV</span>
              </Button>
              
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Listing
              </Button>
            </div>
          </div>

          <AdminListingsTable />
          
          <CreateListingDialog 
            open={showCreateDialog} 
            onOpenChange={setShowCreateDialog} 
          />
          
          <CSVUploadDialog
            open={showCSVUploadDialog}
            onOpenChange={setShowCSVUploadDialog}
            onSuccess={handleCSVUploadSuccess}
          />
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminListings;
