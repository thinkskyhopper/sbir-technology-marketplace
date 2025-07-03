
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminDashboardCard from "@/components/AdminDashboardCard";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";
import { FileText, Building2, Images, Users, History } from "lucide-react";

const Admin = () => {
  const { user } = useAuth();
  const { pendingChangeRequests, pendingListings, loading } = useAdminDashboardStats();

  const adminCards = [
    {
      title: "Change Requests",
      description: "Review and process listing change and deletion requests from users. Approve or reject modifications to existing listings.",
      icon: FileText,
      route: "/admin/change-requests",
      pendingCount: loading ? undefined : pendingChangeRequests,
      pendingLabel: "pending"
    },
    {
      title: "SBIR Listings",
      description: "Manage all SBIR listings, approve new submissions, edit existing listings, and control listing visibility.",
      icon: Building2,
      route: "/admin/listings",
      pendingCount: loading ? undefined : pendingListings,
      pendingLabel: "pending"
    },
    {
      title: "User Management",
      description: "View and manage user accounts, monitor user activity, and review user statistics and listing counts.",
      icon: Users,
      route: "/admin/users"
    },
    {
      title: "Category Images",
      description: "Upload and manage category images that are displayed throughout the platform to enhance visual appeal.",
      icon: Images,
      route: "/admin/category-images"
    },
    {
      title: "Admin Logs",
      description: "Review all administrative actions and changes made to listings. Track approval, rejection, modification, and deletion activities.",
      icon: History,
      route: "/admin/logs"
    }
  ];

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCards.map((card) => (
              <AdminDashboardCard
                key={card.route}
                title={card.title}
                description={card.description}
                icon={card.icon}
                route={card.route}
                pendingCount={card.pendingCount}
                pendingLabel={card.pendingLabel}
              />
            ))}
          </div>

          {/* Quick Stats Overview */}
          {!loading && (pendingChangeRequests > 0 || pendingListings > 0) && (
            <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">Attention Required</h3>
              <div className="text-sm text-orange-700 space-y-1">
                {pendingChangeRequests > 0 && (
                  <p>• {pendingChangeRequests} change request{pendingChangeRequests !== 1 ? 's' : ''} awaiting review</p>
                )}
                {pendingListings > 0 && (
                  <p>• {pendingListings} listing{pendingListings !== 1 ? 's' : ''} pending approval</p>
                )}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
