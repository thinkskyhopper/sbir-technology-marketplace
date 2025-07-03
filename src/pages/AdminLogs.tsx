
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminLogsTable } from "@/components/AdminLogsTable";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-6 py-8 flex-1">
          <div className="mb-6">
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              className="flex items-center gap-2 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Audit Logs</h1>
                <p className="text-muted-foreground">
                  Review all administrative actions and changes made to listings.
                </p>
              </div>
            </div>
          </div>

          <AdminLogsTable />
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminLogs;
