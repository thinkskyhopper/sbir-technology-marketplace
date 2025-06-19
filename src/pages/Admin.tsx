import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import AdminListingsTable from "@/components/AdminListingsTable";
import CreateListingDialog from "@/components/CreateListingDialog";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";
const Admin = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const {
    user
  } = useAuth();
  return <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-6 py-8">
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

          <AdminListingsTable />
          
          <CreateListingDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </div>
      </div>
    </ProtectedRoute>;
};
export default Admin;