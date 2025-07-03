
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminLogsTable } from "@/components/AdminLogsTable";
import { FileText } from "lucide-react";

const AdminLogs = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-6 py-8 flex-1">
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
